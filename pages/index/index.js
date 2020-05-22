//index.js
//获取应用实例
// const app = getApp();

Page({
  data: {
    isPlayingMusic: false,
    bgm: null,
    music_url:
      "https://webfs.yun.kugou.com/202005201038/43d1377738c5d72e6fc6557942b26272/G057/M00/0C/09/GZQEAFaLjA-AEORbAFysYBAILd8406.mp3",
    music_coverImgUrl: "/images/music.png",
  },
  onReady: function () {
    this.bgm = wx.getBackgroundAudioManager();
    this.bgm.title = "marry me";
    this.bgm.epname = "wedding";
    this.bgm.singer = "singer";
    this.bgm.coverImgUrl = this.music_coverImgUrl;
    this.bgm.onCanplay(() => {
      this.bgm.pause();
    });
  },
  play: function (e) {
    if (this.data.isPlayingMusic) {
      this.bgm.pause();
    } else {
      this.bgm.play();
    }
    this.setData({
      isPlayingMusic: !this.data.isPlayingMusic,
    });
  },
  callGroom: function () {
    wx.makePhoneCall({
      phoneNumber: "137000000000",
    });
  },
  callBride: function () {
    wx.makePhoneCall({
      phoneNumber: "137000000000",
    });
  },
});
