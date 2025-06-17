import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';

import styles from './ChatVideoCall.module.scss';

import { sendPostRequest } from '../../../api/requestsApi';
import Button from '../../../uiForm/Button';
import SimplePeer from 'simple-peer';
import ModalWrapper from '../../../ui/Modal/ModalWrapper';
import Modal from '../../../ui/Modal';
import { IconCall, IconCallEnd, IconInfoTooltip, IconMicrophone, IconMicrophoneOff, IconMonitor, IconСamcorder } from '../../../ui/Icons';
import Avatar from '../../../ui/Avatar';
import { capitalizeWords } from '../../../helpers/changeString';
import { ChatContext } from '../../../context';
import { toggleNotificationCall } from '../../../redux/slices/helpSlice';
import UserPosition from '../../../ui/UserPosition';
import { ROLE_BUYER, ROLE_SELLER } from '../../../constants/roles';
import { useSelector } from 'react-redux';
import { getIsDesktop } from '../../../redux/helpers/selectors';
import ChatCallBtn from './ChatCallBtn';
import { getPermissions, sendMediaState, settingsPeer, updateUI } from './chatVideoCallHelpers';

const ChatVideoCall = ({ partnerInfo, authuserid = null }) => {
   const { currentDialog, videoCallData, videoCallActive, setVideoCallActive } = useContext(ChatContext);
   const userVideoRef = useRef(null);
   const partnerVideoRef = useRef(null);
   const isDesktop = useSelector(getIsDesktop);

   const [isFocusMySelf, setIsFocusMySelf] = useState(true);
   const [callPlaced, setCallPlaced] = useState(false);
   const [callPartner, setCallPartner] = useState(null);

   const [mutedAudio, setMutedAudio] = useState(false);
   const [mutedScreenSharing, setMutedScreenSharing] = useState(false);
   const [mutedCamera, setMutedCamera] = useState(false);
   const [cameraMode, setCameraMode] = useState('user');

   const [statusCompanionMedia, setStatusCompanionMedia] = useState({ video: false, audio: false });
   const [statusMedia, setStatusMedia] = useState({ video: false, audio: false });

   const [videoCallParams, setVideoCallParams] = useState({
      users: [],
      stream: null,
      receivingCall: false,
      caller: null,
      callerSignal: null,
      callAccepted: false,
      channel: null,
      peer1: null,
      peer2: null,
   });

   useEffect(() => {
      if (authuserid && partnerInfo?.id && currentDialog) {
         initialize();
      }
   }, [authuserid, partnerInfo]);

   const initialize = () => {
      const channel = window.Echo.join(`video-dialog.${currentDialog.id}`);
      setVideoCallParams(prev => ({ ...prev, channel }));

      channel.here(users => {
         setVideoCallParams(prev => ({ ...prev, users }));
      });

      channel.joining(user => {
         setVideoCallParams(prev => {
            const joiningUserIndex = prev.users.findIndex(data => data === user);
            if (joiningUserIndex < 0) {
               return {
                  ...prev,
                  users: [...prev.users, user],
               };
            }
            return prev;
         });
      });

      channel.leaving(user => {
         setVideoCallParams(prev => {
            const leavingUserIndex = prev.users.findIndex(data => data === user);
            return {
               ...prev,
               users: prev.users.filter((_, index) => index !== leavingUserIndex),
            };
         });
      });

      channel.listen('VideoDialogEvent', ({ data }) => {
         if (data.type === 'incomingCall') {
            setVideoCallParams(prev => ({
               ...prev,
               receivingCall: true,
               caller: data.from,
               callerSignal: {
                  ...data.signalData,
                  sdp: `${data.signalData.sdp}\n`,
               },
            }));
         }
         if (data.type === 'callCanceled') {
            reset();
         }
      });

      if (videoCallData && videoCallData.type === 'incomingCall') {
         setVideoCallParams(prev => ({
            ...prev,
            receivingCall: true,
            caller: videoCallData.from,
            callerSignal: {
               ...videoCallData.signalData,
               sdp: `${videoCallData.signalData.sdp}\n`,
            },
         }));
      }
   };

   const placeVideoCall = async (id, name) => {
      setCallPlaced(true);
      setCallPartner({ id, name });

      const stream = await getPermissions(userVideoRef, 'getUserMedia', setStatusMedia);

      const peer1 = new SimplePeer({
         initiator: true,
         trickle: false,
         stream: stream,
         config: {
            iceServers: [settingsPeer],
         },
      });

      peer1.on('data', data => {
         try {
            const message = JSON.parse(data);
            if (message.type === 'mediaState') {
               updateUI(message.video, message.audio, setStatusCompanionMedia);
            }
         } catch (error) {
            console.error('Ошибка при обработке сообщения:', error);
         }
      });

      setVideoCallParams(prev => ({ ...prev, receivingCall: false, peer1 }));

      peer1.on('signal', data => {
         sendPostRequest('/api/video/call-user', {
            user_to_call: id,
            signal_data: data,
            from: authuserid,
            dialog_id: currentDialog.id,
         })
            .then(() => {})
            .catch(err => {});
      });

      peer1.on('stream', remoteStream => {
         setCallPlaced(true);
         setCallPartner({ id, name });

         if (partnerVideoRef.current) {
            partnerVideoRef.current.srcObject = remoteStream;
         }
      });

      peer1.on('connect', () => {
         setCallPlaced(true);
         setCallPartner({ id, name });
      });

      peer1.on('error', err => {});
      peer1.on('close', () => {
         reset();
      });

      videoCallParams.channel.listen('VideoDialogEvent', ({ data }) => {
         if (data.type === 'callAccepted') {
            if (data.signal.renegotiate) {
            }
            if (data.signal.sdp) {
               setVideoCallParams(prev => ({ ...prev, callAccepted: true }));
               const updatedSignal = {
                  ...data.signal,
                  sdp: `${data.signal.sdp}\n`,
               };

               peer1.signal(updatedSignal);
            }
         }

         if (data.type === 'callCanceled') {
            reset();
         }
      });
   };

   const acceptCall = async () => {
      setCallPlaced(true);
      setVideoCallParams(prev => ({ ...prev, callAccepted: true }));

      const stream = await getPermissions(userVideoRef, 'getUserMedia', setStatusMedia);

      const peer2 = new SimplePeer({
         initiator: false,
         trickle: false,
         stream: stream,
         config: {
            iceServers: [settingsPeer],
         },
      });

      peer2.on('data', data => {
         try {
            const message = JSON.parse(data);
            if (message.type === 'mediaState') {
               updateUI(message.video, message.audio, setStatusCompanionMedia);
            }
         } catch (error) {
            console.error('Ошибка при обработке сообщения:', error);
         }
      });

      setVideoCallParams(prev => ({ ...prev, receivingCall: false, peer2 }));

      peer2.on('signal', data => {
         sendPostRequest('/api/video/accept-call', {
            signal: data,
            to: videoCallParams.caller,
            dialog_id: currentDialog.id,
         }).catch(err => {});
      });

      peer2.on('stream', remoteStream => {
         setVideoCallParams(prev => ({ ...prev, callAccepted: true }));

         if (partnerVideoRef.current) {
            partnerVideoRef.current.srcObject = remoteStream;
         }
      });

      peer2.on('connect', () => {
         setVideoCallParams(prev => ({ ...prev, callAccepted: true }));
      });

      peer2.on('error', err => {
         reset();
      });
      peer2.on('close', () => {
         reset();
      });

      peer2.signal(videoCallParams.callerSignal);
   };

   const toggleCameraArea = () => {
      if (videoCallParams.callAccepted) {
         setIsFocusMySelf(prev => !prev);
      }
   };

   const toggleCamera = useCallback(
      async status => {
         const peer = videoCallParams.peer1 || videoCallParams.peer2;

         if (!peer) return;
         const currentStream = peer.streams.find(stream => stream.getVideoTracks().length > 0);
         if (!currentStream) return;
         currentStream.getVideoTracks().forEach(track => track.stop());

         if (!status) {
            try {
               const screenStream = await getPermissions(userVideoRef, 'getUserMedia', setStatusMedia, {
                  video: true,
                  audio: false,
                  facingMode: 'user',
               });
               const screenVideoTrack = screenStream.getVideoTracks()[0];
               if (!screenVideoTrack) return;

               const oldVideoTrack = peer.streams[0]?.getVideoTracks()[0];
               const audioTrack = peer.streams[0]?.getAudioTracks()[0];

               const newStream = new MediaStream();
               newStream.addTrack(screenVideoTrack);
               if (audioTrack) {
                  newStream.addTrack(audioTrack);
               }
               sendMediaState(peer, true, statusCompanionMedia.audio);
               userVideoRef.current.srcObject = newStream;

               peer.replaceTrack(oldVideoTrack, screenVideoTrack, currentStream);

               setMutedCamera(true);
            } catch (error) {}
         } else {
            const stream = await getPermissions(userVideoRef, 'getUserMedia', setStatusMedia, {
               video: false,
               audio: true,
            });
            const screenVideoTrack = stream.getVideoTracks()[0];
            if (!screenVideoTrack) return;

            const oldVideoTrack = peer.streams[0]?.getVideoTracks()[0];
            const audioTrack = peer.streams[0]?.getAudioTracks()[0];

            const newStream = new MediaStream();
            newStream.addTrack(screenVideoTrack);
            if (audioTrack) {
               newStream.addTrack(audioTrack);
            }

            sendMediaState(peer, false, statusCompanionMedia.audio);
            userVideoRef.current.srcObject = newStream;

            peer.replaceTrack(oldVideoTrack, screenVideoTrack, currentStream);
            setMutedCamera(false);
         }
      },
      [videoCallParams]
   );

   const toggleScreenSharing = useCallback(
      async status => {
         const peer = videoCallParams.peer1 || videoCallParams.peer2;

         if (!peer) return;
         const currentStream = peer.streams.find(stream => stream.getVideoTracks().length > 0);
         if (!currentStream) return;
         currentStream.getVideoTracks().forEach(track => track.stop());

         if (!status) {
            try {
               const screenStream = await getPermissions(userVideoRef, 'getDisplayMedia', setStatusMedia, { video: true, audio: false });
               const screenVideoTrack = screenStream.getVideoTracks()[0];
               if (!screenVideoTrack) return;

               const oldVideoTrack = peer.streams[0]?.getVideoTracks()[0];
               const audioTrack = peer.streams[0]?.getAudioTracks()[0];

               const newStream = new MediaStream();
               newStream.addTrack(screenVideoTrack);
               if (audioTrack) {
                  newStream.addTrack(audioTrack);
               }
               sendMediaState(peer, true, statusCompanionMedia.audio);
               userVideoRef.current.srcObject = newStream;

               peer.replaceTrack(oldVideoTrack, screenVideoTrack, currentStream);

               setMutedScreenSharing(true);
            } catch (error) {}
         } else {
            try {
               const stream = await getPermissions(userVideoRef, 'getDisplayMedia', setStatusMedia);
               const screenVideoTrack = stream.getVideoTracks()[0];

               if (!screenVideoTrack) {
                  return;
               }

               const oldVideoTrack = peer.streams[0]?.getVideoTracks()[0];
               const audioTrack = peer.streams[0]?.getAudioTracks()[0];

               const newStream = new MediaStream();
               newStream.addTrack(screenVideoTrack);
               if (audioTrack) {
                  newStream.addTrack(audioTrack);
               }

               sendMediaState(peer, false, statusCompanionMedia.audio);
               userVideoRef.current.srcObject = newStream;

               peer.replaceTrack(oldVideoTrack, screenVideoTrack, currentStream);
               setMutedScreenSharing(false);
            } catch (error) {}
         }
      },
      [videoCallParams]
   );

   const handleSwitchCamera = useCallback(
      async status => {
         const peer = videoCallParams.peer1 || videoCallParams.peer2;

         if (!peer) return;
         const currentStream = peer.streams.find(stream => stream.getVideoTracks().length > 0);
         if (!currentStream) return;
         currentStream.getVideoTracks().forEach(track => track.stop());

         const screenStream = await getPermissions(userVideoRef, 'getUserMedia', setStatusMedia, {
            video: true,
            audio: false,
            facingMode: status,
         });
         const screenVideoTrack = screenStream.getVideoTracks()[0];
         if (!screenVideoTrack) return;

         const oldVideoTrack = peer.streams[0]?.getVideoTracks()[0];
         const audioTrack = peer.streams[0]?.getAudioTracks()[0];

         const newStream = new MediaStream();
         newStream.addTrack(screenVideoTrack);
         if (audioTrack) {
            newStream.addTrack(audioTrack);
         }

         sendMediaState(peer, true, statusCompanionMedia.audio);
         userVideoRef.current.srcObject = newStream;

         peer.replaceTrack(oldVideoTrack, screenVideoTrack, currentStream);

         setCameraMode(status);
      },
      [videoCallParams]
   );

   const toggleMuteAudio = () => {
      if (userVideoRef.current) {
         const audioTrack = userVideoRef.current.srcObject?.getAudioTracks()[0];
         if (audioTrack) {
            sendMediaState(videoCallParams.peer1 || videoCallParams.peer2, statusCompanionMedia.video, !audioTrack.enabled);
            audioTrack.enabled = !audioTrack.enabled;
            setMutedAudio(prev => !prev);
         }
      }
   };

   const declineCall = () => {
      sendPostRequest('/api/video/cancel-call', {
         user_to_cancel: authuserid,
         dialog_id: currentDialog.id,
      }).then(() => {
         toggleNotificationCall(false);
         reset();
      });
   };

   const endCall = () => {
      sendPostRequest('/api/video/cancel-call', {
         user_to_cancel: authuserid,
         dialog_id: currentDialog.id,
      }).then(() => {
         reset();
      });
   };

   const cancelCall = () => {
      sendPostRequest('/api/video/cancel-call', {
         user_to_cancel: callPartner.id,
         dialog_id: currentDialog.id,
      }).then(() => {
         reset();
      });
   };

   const reset = () => {
      if (videoCallParams.peer1) videoCallParams.peer1.destroy();
      if (videoCallParams.peer2) videoCallParams.peer2.destroy();
      if (userVideoRef.current?.srcObject) userVideoRef.current.srcObject = null;
      if (partnerVideoRef.current?.srcObject) partnerVideoRef.current.srcObject = null;

      setCallPartner(null);
      setCallPlaced(false);
      setVideoCallParams(prev => ({
         ...prev,
         stream: null,
         receivingCall: false,
         callAccepted: false,
         caller: null,
         callerSignal: null,
         peer1: null,
         peer2: null,
      }));
   };

   const incomingCallDialog = videoCallParams.receivingCall && videoCallParams.caller !== authuserid;
   const isActiveCall = Boolean(callPartner || incomingCallDialog || videoCallParams.callAccepted);

   return (
      <ModalWrapper condition={videoCallActive}>
         <Modal
            condition={videoCallActive}
            set={setVideoCallActive}
            options={{
               overlayClassNames: `_full ${!isDesktop && !isActiveCall ? '_bottom' : ''} !z-[10000]`,
               modalContentClassNames: '!bg-transparent !p-0',
            }}
            closeBtnWhite>
            <div className={`${styles.ChatVideoCallContainer} ${isActiveCall ? styles.ChatVideoCallActiveContainer : ''}`}>
               {Boolean(partnerInfo && !videoCallParams.callAccepted) && (
                  <div className={`${styles.ChatVideoCallStart} ${isActiveCall ? styles.ChatVideoCallStartActive : ''}`}>
                     <div className="white-block flex flex-col items-center">
                        <Avatar size={90} src={partnerInfo.image} title={partnerInfo.name} />
                        <h3 className="title-3 mt-4">{capitalizeWords(partnerInfo.name, partnerInfo.surname)}</h3>
                        <p className="text-center mt-2 mb-2 text-primary400">
                           <UserPosition role={partnerInfo.role} buildingName={currentDialog?.building?.name} />
                        </p>

                        <div className="w-full">
                           {(callPartner || incomingCallDialog) && (
                              <div className="text-primary400 text-center mb-5">
                                 {incomingCallDialog ? 'Звонит вам...' : Boolean(!videoCallParams.callAccepted && callPartner) && 'Звоним...'}
                              </div>
                           )}
                           <p className="bg-primary700 px-4 py-3 rounded-lg mmd1:w-max text-center mt-4">
                              По умолчанию ваша камера будет выключена, <br />
                              Вы сможете включить её в ходе беседы
                           </p>
                           {!callPartner && !videoCallParams.callAccepted && !incomingCallDialog && (
                              <Button className="mt-6 flex w-full flex-grow gap-3" onClick={() => placeVideoCall(partnerInfo.id, partnerInfo.name)}>
                                 <IconСamcorder className="stroke-white stroke-[2px]" />
                                 Звонок
                              </Button>
                           )}
                        </div>
                     </div>
                  </div>
               )}
               <div
                  className={`${isFocusMySelf ? styles.userVideo : styles.partnerVideo} ${!videoCallParams.callAccepted ? styles.videoNone : ''} ${
                     callPartner ? styles.ChatVideoBg : ''
                  }`}>
                  {!statusMedia.video && videoCallParams.callAccepted && (
                     <div className={`${styles.videoEmpty} gap-2`}>
                        <IconInfoTooltip className="stroke-white" width={24} height={24} />
                        Вы не передаёте видео
                     </div>
                  )}
                  <video ref={userVideoRef} muted playsInline autoPlay className="w-full h-full" onClick={toggleCameraArea} />
               </div>
               <div className={`${isFocusMySelf ? styles.partnerVideo : styles.userVideo} ${callPartner ? styles.ChatVideoBg : ''}`}>
                  {!statusCompanionMedia.video && videoCallParams.callAccepted && (
                     <div className={styles.videoEmpty}>
                        <div className={styles.videoEmptyInner}>
                           <Avatar size={90} src={partnerInfo.image} title={partnerInfo.name} />
                           {isFocusMySelf && (
                              <>
                                 <h3 className="title-3 mt-4">{capitalizeWords(partnerInfo.name, partnerInfo.surname)}</h3>
                                 {(partnerInfo.role === ROLE_SELLER.id || partnerInfo.role === ROLE_BUYER.id) && (
                                    <p className="text-center mt-2 text-primary400">
                                       <UserPosition role={partnerInfo.role} buildingName={currentDialog?.building?.name} />
                                    </p>
                                 )}
                              </>
                           )}
                        </div>
                     </div>
                  )}
                  <video ref={partnerVideoRef} playsInline autoPlay className="w-full h-full" onClick={toggleCameraArea} />
               </div>
            </div>
            {isActiveCall && (
               <div className={styles.actionBtns}>
                  {/* {Boolean(!isDesktop && statusMedia.video && mutedCamera) && (
                        <ChatCallBtn
                           onChange={() => handleSwitchCamera(cameraMode === 'user' ? 'environment' : 'user')}
                           className={`${cameraMode === 'environment' ? '!bg-[#a8c7fa]' : ''}`}
                           childrenText="Поворот камеры">
                           <IconСamcorder className={`stroke-white stroke-[2px] !fill-none ${mutedCamera ? '!stroke-dark' : ''}`} />
                        </ChatCallBtn>
                     )} */}

                  {videoCallParams.callAccepted && (
                     <>
                        <ChatCallBtn
                           onChange={() => toggleCamera(mutedCamera)}
                           className={`${mutedCamera ? '!bg-[#a8c7fa]' : ''}`}
                           childrenText={mutedCamera ? 'Выкл. камеру' : 'Вкл. камеру'}>
                           <IconСamcorder className={`stroke-white stroke-[2px] !fill-none ${mutedCamera ? '!stroke-dark' : ''}`} />
                        </ChatCallBtn>
                        {isDesktop && (
                           <ChatCallBtn
                              onChange={() => toggleScreenSharing(mutedScreenSharing)}
                              className={`${mutedScreenSharing ? styles.actionBtnActiveBlue : ''}`}
                              childrenText={mutedScreenSharing ? 'Выкл. показ экрана' : 'Вкл. показ экрана'}>
                              <IconMonitor width={24} height={24} className="fill-white" />
                           </ChatCallBtn>
                        )}

                        <ChatCallBtn
                           onChange={toggleMuteAudio}
                           className={`${mutedAudio ? styles.actionBtnActiveRed : ''}`}
                           childrenText={mutedAudio ? 'Вкл. микрофон' : 'Выкл. микрофон'}>
                           {mutedAudio ? (
                              <IconMicrophoneOff width={24} height={24} />
                           ) : (
                              <IconMicrophone width={24} height={24} className="stroke-white !fill-none" />
                           )}
                        </ChatCallBtn>
                     </>
                  )}
                  <ChatCallBtn
                     onChange={() => (incomingCallDialog ? declineCall() : !videoCallParams.callAccepted && callPartner ? cancelCall() : endCall())}
                     className="!bg-red"
                     childrenText={incomingCallDialog ? 'Отменить' : 'Завершить'}>
                     <IconCallEnd width={24} height={24} className="fill-white" />
                  </ChatCallBtn>
                  {incomingCallDialog && (
                     <ChatCallBtn onChange={acceptCall} className="!bg-green" childrenText="Принять">
                        <IconCall width={28} height={28} className="fill-white" />
                     </ChatCallBtn>
                  )}
               </div>
            )}
         </Modal>
      </ModalWrapper>
   );
};

export default ChatVideoCall;
