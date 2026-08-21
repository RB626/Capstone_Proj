import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


/* ══════════════════════════════════════
   WEBRTC CONFIG
══════════════════════════════════════ */

/*
  STUN is enough for localhost/testing.

  For a production Messenger-style
  experience across mobile networks,
  add a TURN server too.
*/
const RTC_CONFIG = {

  iceServers: [

    {
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:stun1.l.google.com:19302"
      ]
    }

  ]

};


/* ══════════════════════════════════════
   INITIALIZE
══════════════════════════════════════ */

export function initBlueSpaceCalling({
  auth,
  db,
  accountCollection
}) {

  const audioCallBtn =
    document.getElementById(
      "chatAudioCallBtn"
    );

  const videoCallBtn =
    document.getElementById(
      "chatVideoCallBtn"
    );


  const overlay =
    document.getElementById(
      "blueCallOverlay"
    );

  const remoteVideo =
    document.getElementById(
      "blueCallRemoteVideo"
    );

  const remoteAudio =
    document.getElementById(
      "blueCallRemoteAudio"
    );

  const localVideo =
    document.getElementById(
      "blueCallLocalVideo"
    );

  const person =
    document.getElementById(
      "blueCallPerson"
    );

  const avatar =
    document.getElementById(
      "blueCallAvatar"
    );

  const nameElement =
    document.getElementById(
      "blueCallName"
    );

  const statusElement =
    document.getElementById(
      "blueCallStatus"
    );


  const incomingActions =
    document.getElementById(
      "blueCallIncomingActions"
    );

  const controls =
    document.getElementById(
      "blueCallControls"
    );


  const acceptBtn =
    document.getElementById(
      "blueCallAcceptBtn"
    );

  const declineBtn =
    document.getElementById(
      "blueCallDeclineBtn"
    );

  const endBtn =
    document.getElementById(
      "blueCallEndBtn"
    );

  const muteBtn =
    document.getElementById(
      "blueCallMuteBtn"
    );

  const cameraBtn =
    document.getElementById(
      "blueCallCameraBtn"
    );


  if (
    !overlay ||
    !audioCallBtn ||
    !videoCallBtn
  ) {

    console.warn(
      "BlueSpace calling UI was not found."
    );

    return;

  }


  let peerConnection =
    null;


  let localStream =
    null;


  let remoteStream =
    null;


  let activeCallRef =
    null;


  let activeCallData =
    null;


  let activeCallRole =
    null;


  let activeCallType =
    null;


  let pendingIncomingRef =
    null;


  let pendingIncomingData =
    null;


  let unsubscribeIncomingCalls =
    null;


  let unsubscribeCallDocument =
    null;


  let unsubscribeRemoteCandidates =
    null;


  let unsubscribePendingIncoming =
    null;


  let pendingRemoteCandidates =
    [];

  /* ══════════════════════════════════════
 CALL RINGING AUDIO
══════════════════════════════════════ */

  let callAudioContext =
    null;


  let callToneInterval =
    null;


  const activeCallToneNodes =
    new Set();


  let currentCallToneMode =
    null;


  let ringTimeout =
    null;


  let microphoneMuted =
    false;


  let cameraDisabled =
    false;


  let cleaningUp =
    false;


  /* ══════════════════════════════════════
     FALLBACK AVATAR
  ═══════════════════════════════════════ */

  function fallbackAvatar(
    name = "User"
  ) {

    return (
      "https://ui-avatars.com/api/" +
      `?name=${encodeURIComponent(name)}` +
      "&background=0f766e" +
      "&color=ffffff" +
      "&size=256"
    );

  }


  /* ══════════════════════════════════════
     MY CURRENT PROFILE
  ═══════════════════════════════════════ */

  async function getMyIdentity() {

    const user =
      auth.currentUser;


    if (!user) {

      return {
        name: "User",
        photoURL:
          fallbackAvatar(
            "User"
          )
      };

    }


    let profileData =
      {};


    try {

      const profileSnapshot =
        await getDoc(
          doc(
            db,
            accountCollection,
            user.uid
          )
        );


      if (
        profileSnapshot.exists()
      ) {

        profileData =
          profileSnapshot.data();

      }

    } catch (error) {

      console.warn(
        "Could not load call profile:",
        error
      );

    }


    const name =

      profileData.fullName ||

      profileData.name ||

      profileData.displayName ||

      user.displayName ||

      "User";


    const photoURL =

      profileData.customPhotoURL ||

      profileData.photoURL ||

      profileData.googlePhotoURL ||

      user.photoURL ||

      fallbackAvatar(
        name
      );


    return {
      name,
      photoURL
    };

  }


  /* ══════════════════════════════════════
     CURRENT CHAT PERSON
  ═══════════════════════════════════════ */

  function getChatIdentity() {

    const chatName =
      document.getElementById(
        "chat-name"
      );


    const chatAvatar =
      document.getElementById(
        "chat-avatar"
      );


    const name =
      String(
        chatName?.textContent ||
        "User"
      ).trim();


    const photoURL =
      chatAvatar?.src ||
      fallbackAvatar(
        name
      );


    return {
      name,
      photoURL
    };

  }

  /* ══════════════════════════════════════
   BLUESPACE CALL SOUNDS
══════════════════════════════════════ */


  /* ──────────────────────────────────────
     GET / CREATE AUDIO CONTEXT
  ────────────────────────────────────── */

  function getCallAudioContext() {

    if (
      !callAudioContext
    ) {

      const AudioContextClass =
        window.AudioContext ||
        window.webkitAudioContext;


      if (
        !AudioContextClass
      ) {

        console.warn(
          "Web Audio is not supported."
        );

        return null;

      }


      callAudioContext =
        new AudioContextClass();

    }


    return callAudioContext;

  }


  /* ──────────────────────────────────────
     UNLOCK BROWSER AUDIO
  ────────────────────────────────────── */

  async function unlockCallAudio() {

    const context =
      getCallAudioContext();


    if (!context) {
      return;
    }


    if (
      context.state ===
      "suspended"
    ) {

      try {

        await context.resume();

      } catch (error) {

        console.warn(
          "CALL AUDIO COULD NOT RESUME:",
          error
        );

      }

    }

  }


  /* ──────────────────────────────────────
     PLAY ONE TONE
  ────────────────────────────────────── */

  function playCallTone({
    frequency,
    delay = 0,
    duration = 0.3,
    volume = 0.045
  }) {

    const context =
      getCallAudioContext();


    if (
      !context ||
      context.state !== "running"
    ) {

      return;

    }


    const oscillator =
      context.createOscillator();


    const gainNode =
      context.createGain();


    oscillator.type =
      "sine";


    oscillator.frequency.value =
      frequency;


    oscillator.connect(
      gainNode
    );


    gainNode.connect(
      context.destination
    );


    const startTime =
      context.currentTime +
      delay;


    const endTime =
      startTime +
      duration;


    /*
      Smooth fade in.
    */
    gainNode.gain.setValueAtTime(
      0.0001,
      startTime
    );


    gainNode.gain.exponentialRampToValueAtTime(
      volume,
      startTime + 0.025
    );


    /*
      Keep volume steady.
    */
    gainNode.gain.setValueAtTime(
      volume,
      Math.max(
        startTime + 0.03,
        endTime - 0.05
      )
    );


    /*
      Smooth fade out.
    */
    gainNode.gain.exponentialRampToValueAtTime(
      0.0001,
      endTime
    );


    oscillator.start(
      startTime
    );


    oscillator.stop(
      endTime + 0.02
    );


    activeCallToneNodes.add(
      oscillator
    );


    oscillator.addEventListener(
      "ended",
      () => {

        activeCallToneNodes.delete(
          oscillator
        );


        try {

          oscillator.disconnect();

          gainNode.disconnect();

        } catch {
          // Already disconnected.
        }

      },
      {
        once: true
      }
    );

  }


  /* ══════════════════════════════════════
     OUTGOING RINGBACK
     What the CALLER hears
  ══════════════════════════════════════ */

  function playOutgoingRingPulse() {

    /*
      First ring.
    */
    playCallTone({
      frequency: 440,
      delay: 0,
      duration: 0.65,
      volume: 0.032
    });


    playCallTone({
      frequency: 480,
      delay: 0,
      duration: 0.65,
      volume: 0.025
    });


    /*
      Second ring.
    */
    playCallTone({
      frequency: 440,
      delay: 0.82,
      duration: 0.65,
      volume: 0.032
    });


    playCallTone({
      frequency: 480,
      delay: 0.82,
      duration: 0.65,
      volume: 0.025
    });

  }


  async function startOutgoingRingback() {

    stopCallSounds();


    currentCallToneMode =
      "outgoing";


    await unlockCallAudio();


    /*
      Another event may have stopped
      the call while audio was resuming.
    */
    if (
      currentCallToneMode !==
      "outgoing"
    ) {

      return;

    }


    /*
      Play immediately.
    */
    playOutgoingRingPulse();


    /*
      Repeat until answered,
      declined, missed, or ended.
    */
    callToneInterval =
      setInterval(
        () => {

          if (
            currentCallToneMode !==
            "outgoing"
          ) {

            return;

          }


          playOutgoingRingPulse();

        },
        3600
      );

  }


  /* ══════════════════════════════════════
     INCOMING RINGTONE
     What the RECEIVER hears
  ══════════════════════════════════════ */

  function playIncomingRingPulse() {

    playCallTone({
      frequency: 659,
      delay: 0,
      duration: 0.24,
      volume: 0.055
    });


    playCallTone({
      frequency: 784,
      delay: 0.30,
      duration: 0.24,
      volume: 0.050
    });


    playCallTone({
      frequency: 659,
      delay: 0.60,
      duration: 0.24,
      volume: 0.055
    });


    playCallTone({
      frequency: 880,
      delay: 0.90,
      duration: 0.34,
      volume: 0.050
    });

  }


  async function startIncomingRingtone() {

    stopCallSounds();


    currentCallToneMode =
      "incoming";


    await unlockCallAudio();


    if (
      currentCallToneMode !==
      "incoming"
    ) {

      return;

    }


    /*
      Ring immediately.
    */
    playIncomingRingPulse();


    /*
      Repeat.
    */
    callToneInterval =
      setInterval(
        () => {

          if (
            currentCallToneMode !==
            "incoming"
          ) {

            return;

          }


          playIncomingRingPulse();

        },
        2450
      );

  }


  /* ══════════════════════════════════════
     STOP ALL CALL SOUNDS
  ══════════════════════════════════════ */

  function stopCallSounds() {

    currentCallToneMode =
      null;


    if (
      callToneInterval
    ) {

      clearInterval(
        callToneInterval
      );


      callToneInterval =
        null;

    }


    /*
      Stop tones that have already
      been scheduled.
    */
    activeCallToneNodes.forEach(
      oscillator => {

        try {

          oscillator.stop();

        } catch {
          // Already stopped.
        }

      }
    );


    activeCallToneNodes.clear();

  }


  /* ══════════════════════════════════════
     PRIME AUDIO AFTER USER INTERACTION
  
     Browsers usually don't allow a site
     to suddenly play sound until the user
     has interacted with the page once.
  ══════════════════════════════════════ */

  function primeCallAudio() {

    unlockCallAudio();

  }


  document.addEventListener(
    "pointerdown",
    primeCallAudio,
    {
      once: true
    }
  );


  document.addEventListener(
    "keydown",
    primeCallAudio,
    {
      once: true
    }
  );


  /* ══════════════════════════════════════
     UI
  ═══════════════════════════════════════ */

  function showCallOverlay({
    type,
    name,
    photoURL,
    status,
    incoming = false
  }) {

    activeCallType =
      type;


    overlay.classList.add(
      "open"
    );


    overlay.classList.toggle(
      "video-mode",
      type === "video"
    );


    overlay.classList.toggle(
      "audio-mode",
      type !== "video"
    );


    overlay.classList.remove(
      "remote-video-ready"
    );


    overlay.setAttribute(
      "aria-hidden",
      "false"
    );


    avatar.src =
      photoURL ||
      fallbackAvatar(
        name
      );


    avatar.alt =
      name;


    nameElement.textContent =
      name;


    statusElement.textContent =
      status;


    incomingActions.hidden =
      !incoming;


    controls.hidden =
      incoming;


    cameraBtn.hidden =
      type !== "video";


    document.body.style.overflow =
      "hidden";

  }


  function hideCallOverlay() {

    overlay.classList.remove(
      "open",
      "video-mode",
      "audio-mode",
      "remote-video-ready"
    );


    overlay.setAttribute(
      "aria-hidden",
      "true"
    );


    incomingActions.hidden =
      true;


    controls.hidden =
      true;


    remoteVideo.srcObject =
      null;


    remoteAudio.srcObject =
      null;


    localVideo.srcObject =
      null;


    document.body.style.overflow =
      "";

  }


  function setCallStatus(
    text
  ) {

    statusElement.textContent =
      text;

  }


  /* ══════════════════════════════════════
     MEDIA
  ═══════════════════════════════════════ */

  async function startLocalMedia(
    type
  ) {

    /*
      Camera is requested ONLY for
      a video call.
    */
    localStream =
      await navigator.mediaDevices
        .getUserMedia(
          {
            audio: true,

            video:
              type === "video"
                ? {
                  facingMode:
                    "user"
                }
                : false
          }
        );


    if (
      type === "video"
    ) {

      localVideo.srcObject =
        localStream;

    }


    return localStream;

  }


  function stopLocalMedia() {

    localStream
      ?.getTracks()
      .forEach(
        track => {

          track.stop();

        }
      );


    localStream =
      null;

  }


  /* ══════════════════════════════════════
     REMOTE ICE CANDIDATES
  ═══════════════════════════════════════ */

  async function addOrQueueRemoteCandidate(
    candidateData
  ) {

    if (
      !peerConnection
    ) {
      return;
    }


    if (
      !peerConnection.remoteDescription
    ) {

      pendingRemoteCandidates.push(
        candidateData
      );

      return;

    }


    try {

      await peerConnection
        .addIceCandidate(
          new RTCIceCandidate(
            candidateData
          )
        );

    } catch (error) {

      console.error(
        "Could not add ICE candidate:",
        error
      );

    }

  }


  async function flushRemoteCandidates() {

    if (
      !peerConnection ||
      !peerConnection.remoteDescription
    ) {
      return;
    }


    const candidates = [
      ...pendingRemoteCandidates
    ];


    pendingRemoteCandidates =
      [];


    for (
      const candidate
      of candidates
    ) {

      try {

        await peerConnection
          .addIceCandidate(
            new RTCIceCandidate(
              candidate
            )
          );

      } catch (error) {

        console.error(
          "Queued ICE candidate failed:",
          error
        );

      }

    }

  }


  /* ══════════════════════════════════════
     CREATE PEER
  ═══════════════════════════════════════ */

  async function createPeerConnection({
    callRef,
    role,
    type
  }) {

    peerConnection =
      new RTCPeerConnection(
        RTC_CONFIG
      );


    remoteStream =
      new MediaStream();


    /*
      Add our microphone/camera.
    */
    localStream
      ?.getTracks()
      .forEach(
        track => {

          peerConnection.addTrack(
            track,
            localStream
          );

        }
      );


    /*
      Receive the other person's
      audio/video.
    */
    peerConnection.ontrack =
      event => {

        event.streams?.[0]
          ?.getTracks()
          .forEach(
            track => {

              if (
                !remoteStream
                  .getTracks()
                  .some(
                    existingTrack =>
                      existingTrack.id ===
                      track.id
                  )
              ) {

                remoteStream.addTrack(
                  track
                );

              }

            }
          );


        if (
          type === "video"
        ) {

          remoteVideo.srcObject =
            remoteStream;


          overlay.classList.add(
            "remote-video-ready"
          );

        } else {

          remoteAudio.srcObject =
            remoteStream;

        }

      };


    /*
      Store our network candidates
      in Firestore.
    */
    peerConnection.onicecandidate =
      async event => {

        if (
          !event.candidate
        ) {
          return;
        }


        const collectionName =
          role === "caller"
            ? "callerCandidates"
            : "calleeCandidates";


        try {

          await addDoc(
            collection(
              callRef,
              collectionName
            ),
            {
              ...event.candidate
                .toJSON(),

              createdAt:
                serverTimestamp()
            }
          );

        } catch (error) {

          console.error(
            "Could not save ICE candidate:",
            error
          );

        }

      };


    peerConnection.onconnectionstatechange =
      () => {

        const state =
          peerConnection
            ?.connectionState;


        if (
          state === "connected"
        ) {

          setCallStatus(
            "Connected"
          );

        }


        if (
          state === "failed"
        ) {

          setCallStatus(
            "Call failed"
          );


          endCurrentCall(
            "connection-failed"
          );

        }

      };


    /*
      Listen for the OTHER person's
      ICE candidates.
    */
    const remoteCandidateCollection =
      role === "caller"
        ? "calleeCandidates"
        : "callerCandidates";


    unsubscribeRemoteCandidates =
      onSnapshot(
        collection(
          callRef,
          remoteCandidateCollection
        ),

        snapshot => {

          snapshot
            .docChanges()
            .forEach(
              change => {

                if (
                  change.type !==
                  "added"
                ) {
                  return;
                }


                addOrQueueRemoteCandidate(
                  change.doc.data()
                );

              }
            );

        }
      );

  }


  /* ══════════════════════════════════════
     WATCH ACTIVE CALL
  ═══════════════════════════════════════ */

  function listenToActiveCall(
    callRef,
    role
  ) {

    unsubscribeCallDocument?.();


    unsubscribeCallDocument =
      onSnapshot(
        callRef,

        async snapshot => {

          if (
            !snapshot.exists()
          ) {

            cleanupCall();

            return;

          }


          const data =
            snapshot.data();


          activeCallData =
            data;


          if (
            data.status ===
            "accepted"
          ) {

            clearTimeout(
              ringTimeout
            );


            /*
              Stop caller ringback.
            */
            stopCallSounds();


            setCallStatus(
              "Connected"
            );

          }


          /*
            Caller receives the answer.
          */
          if (
            role === "caller" &&
            data.answer &&
            peerConnection &&
            !peerConnection
              .currentRemoteDescription
          ) {

            try {

              await peerConnection
                .setRemoteDescription(
                  new RTCSessionDescription(
                    data.answer
                  )
                );


              await flushRemoteCandidates();

            } catch (error) {

              console.error(
                "Failed to set call answer:",
                error
              );

            }

          }


          if (
            data.status ===
            "declined"
          ) {

            stopCallSounds();


            setCallStatus(
              "Call declined"
            );


            setTimeout(
              cleanupCall,
              900
            );

          }


          if (
            data.status ===
            "ended" ||
            data.status ===
            "missed"
          ) {

            /*
              Stop either ringtone or ringback.
            */
            stopCallSounds();


            setCallStatus(
              data.status ===
                "missed"
                ? "No answer"
                : "Call ended"
            );


            setTimeout(
              cleanupCall,
              700
            );

          }

        }
      );

  }


  /* ══════════════════════════════════════
     START OUTGOING CALL
  ═══════════════════════════════════════ */

  async function startOutgoingCall(
    type
  ) {

    if (
      activeCallRef ||
      pendingIncomingRef
    ) {

      alert(
        "You already have an active call."
      );

      return;

    }


    const user =
      auth.currentUser;


    if (!user) {

      alert(
        "Please log in first."
      );

      return;

    }


    const conversationId =
      window.activeConversationId;


    if (!conversationId) {

      alert(
        "Select a conversation first."
      );

      return;

    }


    try {

      const conversationRef =
        doc(
          db,
          "conversations",
          conversationId
        );


      const conversationSnapshot =
        await getDoc(
          conversationRef
        );


      if (
        !conversationSnapshot.exists()
      ) {

        alert(
          "Conversation could not be found."
        );

        return;

      }


      const conversation =
        conversationSnapshot.data();


      const participantIds =
        Array.isArray(
          conversation.participantIds
        )
          ? conversation.participantIds
          : [];


      if (
        !participantIds.includes(
          user.uid
        )
      ) {

        alert(
          "You are not a participant in this conversation."
        );

        return;

      }


      const calleeId =
        participantIds.find(
          participantId =>
            participantId !==
            user.uid
        );


      if (!calleeId) {

        alert(
          "The other participant could not be found."
        );

        return;

      }


      const myIdentity =
        await getMyIdentity();


      const otherIdentity =
        getChatIdentity();


      showCallOverlay(
        {
          type,

          name:
            otherIdentity.name,

          photoURL:
            otherIdentity.photoURL,

          status:
            type === "video"
              ? "Starting video call..."
              : "Calling...",

          incoming:
            false
        }
      );


      /*
        Get permission before ringing
        the other person.
      */
      await startLocalMedia(
        type
      );


      const callRef =
        doc(
          collection(
            db,
            "calls"
          )
        );


      activeCallRef =
        callRef;


      activeCallRole =
        "caller";


      /*
        Create parent FIRST.

        ICE candidates require this
        document for security rules.
      */
      await setDoc(
        callRef,
        {

          conversationId,

          callerId:
            user.uid,

          calleeId,

          callerName:
            myIdentity.name,

          callerPhotoURL:
            myIdentity.photoURL,

          type,

          status:
            "preparing",

          createdAt:
            serverTimestamp(),

          createdAtMs:
            Date.now()

        }
      );


      await createPeerConnection(
        {
          callRef,
          role:
            "caller",
          type
        }
      );


      const offer =
        await peerConnection
          .createOffer();


      await peerConnection
        .setLocalDescription(
          offer
        );


      await updateDoc(
        callRef,
        {

          offer: {
            type:
              offer.type,

            sdp:
              offer.sdp
          },

          status:
            "ringing"

        }
      );


      setCallStatus(
        "Ringing..."
      );


      /*
        NEW:
        Caller hears ringback.
      */
      startOutgoingRingback();


      listenToActiveCall(
        callRef,
        "caller"
      );


      /*
        End unanswered calls after
        45 seconds.
      */
      ringTimeout =
        setTimeout(
          async () => {

            if (
              activeCallRef?.id !==
              callRef.id
            ) {
              return;
            }


            if (
              activeCallData?.status ===
              "accepted"
            ) {
              return;
            }


            try {

              await updateDoc(
                callRef,
                {
                  status:
                    "missed",

                  endedAt:
                    serverTimestamp()
                }
              );

            } catch (
            error
            ) {

              console.warn(
                "Could not mark call missed:",
                error
              );

            }

          },
          45000
        );


    } catch (error) {

      console.error(
        "START CALL ERROR:",
        error
      );


      if (
        error?.name ===
        "NotAllowedError"
      ) {

        alert(
          type === "video"
            ? "Camera or microphone permission was denied."
            : "Microphone permission was denied."
        );

      } else {

        alert(
          "The call could not be started."
        );

      }


      /*
        If we already created a call,
        tell the other participant it
        has ended.
      */
      if (
        activeCallRef
      ) {

        try {

          await updateDoc(
            activeCallRef,
            {
              status:
                "ended",

              endedAt:
                serverTimestamp()
            }
          );

        } catch {
          // Ignore cleanup failure.
        }

      }


      cleanupCall();

    }

  }


  /* ══════════════════════════════════════
     SHOW INCOMING CALL
  ═══════════════════════════════════════ */

  function showIncomingCall(
    callRef,
    data
  ) {

    if (
      activeCallRef
    ) {

      /*
        Already talking to somebody.
      */
      updateDoc(
        callRef,
        {
          status:
            "declined",

          endReason:
            "busy",

          endedAt:
            serverTimestamp()
        }
      ).catch(
        () => { }
      );


      return;

    }


    pendingIncomingRef =
      callRef;


    pendingIncomingData =
      data;


    showCallOverlay(
      {
        type:
          data.type ||
          "audio",

        name:
          data.callerName ||
          "Incoming call",

        photoURL:
          data.callerPhotoURL ||
          fallbackAvatar(
            data.callerName ||
            "User"
          ),

        status:
          data.type ===
            "video"
            ? "Incoming video call"
            : "Incoming voice call",

        incoming:
          true
      }
    );

    startIncomingRingtone();


    /*
      If caller cancels before we answer,
      close incoming UI automatically.
    */
    unsubscribePendingIncoming?.();


    unsubscribePendingIncoming =
      onSnapshot(
        callRef,

        snapshot => {

          if (
            !snapshot.exists()
          ) {

            cleanupPendingIncoming();

            return;

          }


          const latest =
            snapshot.data();


          if (
            latest.status !==
            "ringing"
          ) {

            if (
              !activeCallRef
            ) {

              cleanupPendingIncoming();

            }

          }

        }
      );

  }


  /* ══════════════════════════════════════
     ACCEPT INCOMING CALL
  ═══════════════════════════════════════ */

  async function acceptIncomingCall() {

    if (
      !pendingIncomingRef ||
      !pendingIncomingData
    ) {
      return;
    }


    /*
      NEW:
      Stop incoming ringtone as soon
      as Accept is pressed.
    */
    stopCallSounds();


    const user =
      auth.currentUser;


    if (!user) {
      return;
    }


    const callRef =
      pendingIncomingRef;


    try {

      const callSnapshot =
        await getDoc(
          callRef
        );


      if (
        !callSnapshot.exists()
      ) {

        cleanupPendingIncoming();

        return;

      }


      const callData =
        callSnapshot.data();


      if (
        callData.status !==
        "ringing"
      ) {

        cleanupPendingIncoming();

        return;

      }


      if (
        callData.calleeId !==
        user.uid
      ) {

        return;

      }


      const type =
        callData.type ||
        "audio";


      activeCallRef =
        callRef;


      activeCallData =
        callData;


      activeCallRole =
        "callee";


      activeCallType =
        type;


      incomingActions.hidden =
        true;


      controls.hidden =
        false;


      cameraBtn.hidden =
        type !== "video";


      setCallStatus(
        "Connecting..."
      );


      /*
        Camera/mic permission is requested
        only AFTER the user presses Accept.
      */
      await startLocalMedia(
        type
      );


      await createPeerConnection(
        {
          callRef,
          role:
            "callee",
          type
        }
      );


      if (
        !callData.offer
      ) {

        throw new Error(
          "Call offer is missing."
        );

      }


      await peerConnection
        .setRemoteDescription(
          new RTCSessionDescription(
            callData.offer
          )
        );


      await flushRemoteCandidates();


      const answer =
        await peerConnection
          .createAnswer();


      await peerConnection
        .setLocalDescription(
          answer
        );


      await updateDoc(
        callRef,
        {

          answer: {
            type:
              answer.type,

            sdp:
              answer.sdp
          },

          status:
            "accepted",

          acceptedAt:
            serverTimestamp()

        }
      );


      unsubscribePendingIncoming?.();

      unsubscribePendingIncoming =
        null;


      pendingIncomingRef =
        null;


      pendingIncomingData =
        null;


      listenToActiveCall(
        callRef,
        "callee"
      );


    } catch (error) {

      console.error(
        "ACCEPT CALL ERROR:",
        error
      );


      if (
        error?.name ===
        "NotAllowedError"
      ) {

        alert(
          activeCallType ===
            "video"
            ? "Camera or microphone permission was denied."
            : "Microphone permission was denied."
        );

      } else {

        alert(
          "The call could not be connected."
        );

      }


      try {

        await updateDoc(
          callRef,
          {
            status:
              "ended",

            endReason:
              "accept-failed",

            endedAt:
              serverTimestamp()
          }
        );

      } catch {
        // Ignore.
      }


      cleanupCall();

    }

  }


  /* ══════════════════════════════════════
     DECLINE
  ═══════════════════════════════════════ */

  async function declineIncomingCall() {

    /*
      Stop incoming ringtone.
    */
    stopCallSounds();


    if (
      !pendingIncomingRef
    ) {
      return;
    }


    const callRef =
      pendingIncomingRef;


    try {

      await updateDoc(
        callRef,
        {
          status:
            "declined",

          declinedAt:
            serverTimestamp()
        }
      );

    } catch (error) {

      console.error(
        "DECLINE CALL ERROR:",
        error
      );

    }


    cleanupPendingIncoming();

  }


  /* ══════════════════════════════════════
     END CURRENT CALL
  ═══════════════════════════════════════ */

  async function endCurrentCall(
    reason = "user-ended"
  ) {

    if (
      cleaningUp
    ) {
      return;
    }


    const callRef =
      activeCallRef;


    if (
      callRef
    ) {

      try {

        await updateDoc(
          callRef,
          {
            status:
              "ended",

            endedBy:
              auth.currentUser?.uid ||
              "",

            endReason:
              reason,

            endedAt:
              serverTimestamp()
          }
        );

      } catch (error) {

        console.warn(
          "Could not update ended call:",
          error
        );

      }

    }


    cleanupCall();

  }


  /* ══════════════════════════════════════
     MICROPHONE
  ═══════════════════════════════════════ */

  function toggleMicrophone() {

    if (!localStream) {
      return;
    }


    microphoneMuted =
      !microphoneMuted;


    localStream
      .getAudioTracks()
      .forEach(
        track => {

          track.enabled =
            !microphoneMuted;

        }
      );


    muteBtn.classList.toggle(
      "active",
      microphoneMuted
    );


    const label =
      muteBtn.querySelector(
        "small"
      );


    if (label) {

      label.textContent =
        microphoneMuted
          ? "Unmute"
          : "Mute";

    }

  }


  /* ══════════════════════════════════════
     CAMERA
  ═══════════════════════════════════════ */

  function toggleCamera() {

    if (
      !localStream ||
      activeCallType !==
      "video"
    ) {
      return;
    }


    cameraDisabled =
      !cameraDisabled;


    localStream
      .getVideoTracks()
      .forEach(
        track => {

          track.enabled =
            !cameraDisabled;

        }
      );


    cameraBtn.classList.toggle(
      "active",
      cameraDisabled
    );


    const label =
      cameraBtn.querySelector(
        "small"
      );


    if (label) {

      label.textContent =
        cameraDisabled
          ? "Camera On"
          : "Camera";

    }

  }


  /* ══════════════════════════════════════
     CLEANUP PENDING INCOMING
  ═══════════════════════════════════════ */

  function cleanupPendingIncoming() {

    /*
      Safety:
      Never leave ringtone running.
    */
    stopCallSounds();


    unsubscribePendingIncoming?.();

    unsubscribePendingIncoming =
      null;


    pendingIncomingRef =
      null;


    pendingIncomingData =
      null;


    if (
      !activeCallRef
    ) {

      hideCallOverlay();

    }

  }


  /* ══════════════════════════════════════
     CLEANUP ACTIVE CALL
  ═══════════════════════════════════════ */

  function cleanupCall() {

    if (
      cleaningUp
    ) {
      return;
    }


    /*
      Stop every ringtone / ringback.
    */
    stopCallSounds();


    cleaningUp =
      true;


    clearTimeout(
      ringTimeout
    );


    ringTimeout =
      null;


    unsubscribeCallDocument?.();

    unsubscribeCallDocument =
      null;


    unsubscribeRemoteCandidates?.();

    unsubscribeRemoteCandidates =
      null;


    unsubscribePendingIncoming?.();

    unsubscribePendingIncoming =
      null;


    stopLocalMedia();


    try {

      peerConnection?.close();

    } catch {
      // Ignore.
    }


    peerConnection =
      null;


    remoteStream =
      null;


    activeCallRef =
      null;


    activeCallData =
      null;


    activeCallRole =
      null;


    activeCallType =
      null;


    pendingIncomingRef =
      null;


    pendingIncomingData =
      null;


    pendingRemoteCandidates =
      [];


    microphoneMuted =
      false;


    cameraDisabled =
      false;


    muteBtn.classList.remove(
      "active"
    );


    cameraBtn.classList.remove(
      "active"
    );


    const muteLabel =
      muteBtn.querySelector(
        "small"
      );


    if (muteLabel) {

      muteLabel.textContent =
        "Mute";

    }


    const cameraLabel =
      cameraBtn.querySelector(
        "small"
      );


    if (cameraLabel) {

      cameraLabel.textContent =
        "Camera";

    }


    hideCallOverlay();


    cleaningUp =
      false;

  }


  /* ══════════════════════════════════════
     LISTEN FOR INCOMING CALLS
  ═══════════════════════════════════════ */

  function listenForIncomingCalls(
    uid
  ) {

    unsubscribeIncomingCalls?.();


    const incomingQuery =
      query(
        collection(
          db,
          "calls"
        ),

        where(
          "calleeId",
          "==",
          uid
        ),

        where(
          "status",
          "==",
          "ringing"
        )
      );


    unsubscribeIncomingCalls =
      onSnapshot(
        incomingQuery,

        snapshot => {

          snapshot
            .docChanges()
            .forEach(
              change => {

                if (
                  change.type !==
                  "added" &&
                  change.type !==
                  "modified"
                ) {
                  return;
                }


                const data =
                  change.doc.data();


                /*
                  Ignore stale ringing
                  documents older than
                  about 90 seconds.
                */
                if (
                  data.createdAtMs &&
                  Date.now() -
                  data.createdAtMs >
                  90000
                ) {

                  updateDoc(
                    change.doc.ref,
                    {
                      status:
                        "missed",

                      endedAt:
                        serverTimestamp()
                    }
                  ).catch(
                    () => { }
                  );


                  return;

                }


                if (
                  pendingIncomingRef?.id ===
                  change.doc.id ||
                  activeCallRef?.id ===
                  change.doc.id
                ) {

                  return;

                }


                showIncomingCall(
                  change.doc.ref,
                  data
                );

              }
            );

        },

        error => {

          console.error(
            "INCOMING CALL LISTENER ERROR:",
            error
          );

        }
      );

  }


  /* ══════════════════════════════════════
     AUTH
  ═══════════════════════════════════════ */

  onAuthStateChanged(
    auth,

    user => {

      if (user) {

        listenForIncomingCalls(
          user.uid
        );

      } else {

        unsubscribeIncomingCalls?.();

        unsubscribeIncomingCalls =
          null;


        cleanupCall();

      }

    }
  );


  /* ══════════════════════════════════════
     BUTTON EVENTS
  ═══════════════════════════════════════ */

  audioCallBtn.addEventListener(
    "click",
    () => {

      startOutgoingCall(
        "audio"
      );

    }
  );


  videoCallBtn.addEventListener(
    "click",
    () => {

      startOutgoingCall(
        "video"
      );

    }
  );


  acceptBtn.addEventListener(
    "click",
    acceptIncomingCall
  );


  declineBtn.addEventListener(
    "click",
    declineIncomingCall
  );


  endBtn.addEventListener(
    "click",
    () => {

      endCurrentCall(
        "user-ended"
      );

    }
  );


  muteBtn.addEventListener(
    "click",
    toggleMicrophone
  );


  cameraBtn.addEventListener(
    "click",
    toggleCamera
  );


  /*
    Do not silently end the remote call
    from beforeunload because browsers
    often block async Firestore writes.

    We DO stop local hardware.
  */
  window.addEventListener(
    "beforeunload",
    () => {

      /*
        Stop ringtone.
      */
      stopCallSounds();


      /*
        Stop mic/camera.
      */
      stopLocalMedia();


      try {

        peerConnection?.close();

      } catch {
        // Ignore.
      }

    }
  );

}