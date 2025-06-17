const chatErrorsData = [
   {
      name: 'access',
      title: 'Ошибка доступа к микрофону',
      descr: 'Убедитесь что у вас подключён микрофон',
   },
];

export const startRecording = async (mediaRecorderRef, setIsVoiceRecording, setError, timerRef, setTime, sendVoiceRecorder) => {
   try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks = [];

      mediaRecorder.ondataavailable = event => {
         if (event.data.size > 0) {
            chunks.push(event.data);
         }
      };

      mediaRecorder.onstop = async () => {
         const blob = new Blob(chunks, { type: 'audio/ogg' });
         setIsVoiceRecording(false);
         sendVoiceRecorder(blob);
      };

      mediaRecorder.start();
      setIsVoiceRecording(true);
      startTimer(timerRef, setTime);
   } catch (error) {
      let currentError = 'access';
      setError({ ...chatErrorsData.find(item => item.name === currentError), error });
   }
};

export const stopRecording = (mediaRecorderRef, setIsVoiceRecording, timerRef) => {
   mediaRecorderRef.current = null;
   setIsVoiceRecording(false);

   stopTimer(timerRef);
};

export const saveRecording = (mediaRecorderRef, setIsVoiceRecording, timerRef) => {
   mediaRecorderRef.current.stop();
   mediaRecorderRef.current = null;
   setIsVoiceRecording(false);

   stopTimer(timerRef);
};

export const formatTimeRecording = milliseconds => {
   const totalSeconds = Math.floor(milliseconds / 1000);
   const minutes = Math.floor(totalSeconds / 60);
   const seconds = totalSeconds % 60;
   const ms = Math.floor((milliseconds % 1000) / 100);

   return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${ms}`;
};

const startTimer = (timerRef, setTime) => {
   setTime(0);
   timerRef.current = setInterval(() => {
      setTime(prevTime => prevTime + 100);
   }, 100);
};

const stopTimer = timerRef => {
   clearInterval(timerRef.current);
   timerRef.current = null;
};
