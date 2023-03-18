// tonejsライブラリのインポート
import * as Tone from "https://cdn.skypack.dev/tone";

// DOM取得 ボタン
const playBtn = document.getElementById("play-btn");
const clearBtn = document.getElementById("clear-btn");
const buttons = document.querySelectorAll("button");

// DOM取得　ドラム
const stepSeq = document.getElementById("LEDStep").children;
const kickSeq = document.getElementById("kick").children;
const snareSeq = document.getElementById("snare").children;
const clapSeq = document.getElementById("clap").children;
const closedHatSeq = document.getElementById("closedHat").children;

// ピアノシーケンスの状態を管理する２次元配列生成の関数
const makePianoGrid = () => {
  let grid = [];
  for (let i = 0; i < 7; i++) {
    let row = [];
    for (let j = 0; j < 16; j++) {
      row.push(false);
    }
    grid.push(row);
  }
  return grid;
};

// ２次元配列生成
const grid = makePianoGrid();

// 音色の設定(ドラム)
const kick = new Tone.MembraneSynth().toDestination();
const snare = new Tone.NoiseSynth({
  noise: {
    type: "pink",
    playbackRate: 3,
    fadeIn: 0.001,
    fadeOut: 0.2,
  },
  envelope: {
    attack: 0.001,
    decay: 0.15,
    sustain: 0,
    release: 0.05,
  },
}).toDestination();
const clap = new Tone.NoiseSynth({
  noise: {
    type: "white",
    playbackRate: 3,
    fadeIn: 0.001,
    fadeOut: 0.2,
  },
  envelope: {
    attack: 0.001,
    decay: 0.05,
    sustain: 0,
    release: 0.05,
  },
}).toDestination();
const hihat = new Tone.NoiseSynth({
  noise: {
    type: "white",
    playbackRate: 3,
    fadeIn: 0.001,
    fadeOut: 0.2,
  },
  envelope: {
    attack: 0.001,
    decay: 0.1,
    sustain: 0,
    release: 0.05,
  },
}).toDestination();

// 音色の設定(ピアノ)
const notes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4"];
let synth;
const synths = [];
const makeSynths = (num) => {
  for (let i = 0; i < num; i++) {
    synth = new Tone.Synth().toDestination();
    synths.push(synth);
  }
};

// シンセ生成
makeSynths(7);

// 必要な変数の宣言
let audioInitialised = false;
let isPlaying = false;
let index = 0;

// LEDステップの初期化
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
    e.target.value = "PLAY";
    // ループをとめる
    Tone.Transport.stop();
    loop.stop();
    isPlaying = false;
  } else {
    e.target.value = "STOP";
    // シーケンスの最初のノートからループを開始
    Tone.Transport.start();
    loop.start(0);
    isPlaying = true;
  }
});

// CLEARボタンが押された時の挙動
clearBtn.addEventListener("click", () => {
  // ドラムのシーケンス
  for (let i = 0; i < 16; i++) {
    kickSeq[i].checked = false;
    snareSeq[i].checked = false;
    clapSeq[i].checked = false;
    closedHatSeq[i].checked = false;
  }
});

// ピアノシーケンスのボタンの状態管理(押されたらture/falseを反転)

buttons.forEach((button, index) => {
  button.addEventListener("click", () => {
    const i = Math.floor(index / 16);
    const j = index % 16;
    grid[i][j] = !grid[i][j];
    if (grid[i][j]) {
      button.style = "background: red";
    } else {
      button.style = "background: #7eefc5";
    }
  });
});

// シーケンサーのループ処理
const loop = new Tone.Loop((time) => {
  // シーケンサーが今どこを走っているかを色で表示
  // 1回色をリセット
  for (let i = 0; i < 16; i++) {
    stepSeq[i].style.background = "#add6c7";
  }
  // 現在のステップのみ色を変更
  stepSeq[index].style.background = "red";

  // ドラム発音
  if (kickSeq[index].checked) {
    kick.triggerAttackRelease("C2", "8n", time);
  }
  if (snareSeq[index].checked) {
    snare.triggerAttackRelease("16n", time);
  }
  if (clapSeq[index].checked) {
    clap.triggerAttackRelease("16n", time);
  }
  if (closedHatSeq[index].checked) {
    hihat.triggerAttackRelease("32n", time);
  }

  // ピアノ発音
  grid.forEach((row, i) => {
    let synth = synths[i];
    if (row[index]) {
      synth.triggerAttackRelease(notes[i], "8n");
    }
  });

  index++;
  index = index % 16;
}, "16n");
