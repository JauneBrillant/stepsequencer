import * as Tone from "https://cdn.skypack.dev/tone";

// DOM取得 ボタン
const playBtn = document.getElementById("play-btn");
const allClearBtn = document.getElementById("all-clear");

// DOM取得 シーケンサー
const stepSeq = document.getElementById("LEDStep").children;
const kickSeq = document.getElementById("kick").children;
const snareSeq = document.getElementById("snare").children;
const clapSeq = document.getElementById("clap").children;
const closedHatSeq = document.getElementById("closedHat").children;
const openHatSeq = document.getElementById("openHat").children;

// 複数のサンプルを読み込む
// const sampler = new Tone.Sampler({
//   urls: {
//     C1: "{% static 'app1/audio/kick.wav' %}",
//     C2: "{% static 'audio/snare.wav' %}",
//     C3: "{% static 'audio/clap.wav' %}",
//     C4: "{% static 'audio/closedhat.wav' %}",
//     C5: "{% static 'audio/openhat.wav' %}",
//   },
//   onload: () => {
//     console.log("sample loaded");
//   },
// }).toDestination();

// 音色の設定
const kick = new Tone.MembraneSynth().toDestination();
const snare = new Tone.NoiseSynth().toDestination();
const hihat = new Tone.MetalSynth({
  envelope: {
    decay: 0.05,
    sustain: 0.2,
    release: 0.5,
  },
}).toDestination();

// CLEARボタンが押された時の挙動
allClearBtn.addEventListener("click", () => {
  for (let i = 0; i < 16; i++) {
    kickSeq[i].checked = false;
    snareSeq[i].checked = false;
    closedHatSeq[i].checked = false;
  }
});

// 必要な変数の宣言
let audioInitialised = false;
let isPlaying = false;
let index = 0;

// 最初のステップLEDを赤に設定
stepSeq[0].style = "background: red";

// BPM設定
Tone.Transport.bpm.value = 120;

// PLAYボタンが押された時の挙動
playBtn.addEventListener("click", (e) => {
  if (!audioInitialised) {
    Tone.start();
    audioInitialised = true;
  }
  if (isPlaying) {
    e.target.innerText = "PLAY";
    // ループをとめる
    Tone.Transport.stop();
    isPlaying = false;
  } else {
    e.target.innerText = "STOP";
    Tone.Transport.start();
    // シーケンスの最初のノートからループを開始
    loop.start(0);
    isPlaying = true;
  }
});

// シーケンサーのループ処理
const loop = new Tone.Loop((time) => {
  // シーケンサーが今どこを走っているか
  // 1回色をリセットしてから、現在のノートだけ色を変える
  for (let i = 0; i < 16; i++) {
    stepSeq[i].style.background = "#add6c7";
  }
  stepSeq[index].style.background = "red";

  // 音を鳴らす
  if (kickSeq[index].checked) {
    kick.triggerAttackRelease("C2", "8n", time);
  }
  if (snareSeq[index].checked) {
    snare.triggerAttackRelease("16n", time);
  }
  if (clapSeq[index].checked) {
  }
  if (closedHatSeq[index].checked) {
    hihat.triggerAttackRelease("C7", "32n", time);
  }
  if (openHatSeq[index].checked) {
  }
  index++;
  index = index % 16;
}, "16n");
