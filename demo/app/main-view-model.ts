import { Observable } from 'data/observable';
import { screen } from "platform";
import { EventData } from 'data/observable';
import { Page } from 'ui/page';
import { isAndroid, isIOS } from 'platform';
import { topmost } from 'ui/frame';
import { setInterval } from "timer";
import { Video } from 'nativescript-videoplayer';
import * as application from "application";
declare var android: any;

export class HelloWorldModel extends Observable {
  public videoSrc: string;
  public currentTime: any;
  public videoDuration: any;
  private _videoPlayer: Video;

  screenWidth = 320;

  playerWidth = 320;
  playerHeight = 320;
  playerOffsetX = 0;
  playerOffsetY = 0;

  // @ViewChild("videoPlayer") videoPlayer:ElementRef;

  constructor(mainpage: Page) {
    super();

    this._videoPlayer = <Video>mainpage.getViewById('nativeVideoPlayer');
    this.currentTime = '';
    this.videoDuration = '';
    this.getVideoDuration();
    this.trackVideoCurrentPosition();

    this.screenWidth = screen.mainScreen.widthPixels / screen.mainScreen.scale
    this.playerWidth = this.screenWidth
    this.playerHeight = this.screenWidth
  }

  /**
   * Video Finished callback
   */
  public videoFinished(args) {
    console.log('video finished event executed');
  }


  /**
   * Pause the video
   */
  public pauseVideo() {
    this._videoPlayer.pause();
  }


  /**
   * Play the video
   */
  public playVideo() {
    this._videoPlayer.play();
    this.set('videoDuration', this._videoPlayer.getDuration());
  }


  /**
   * Stop the video player
   */
  public stopVideo() {
    if (isAndroid) {
      this._videoPlayer.stop();
    }
  }


  /**
   * Get the video duration
   */
  public getVideoDuration() {
    let videoDuration = this._videoPlayer.getDuration();
    console.log('Video Duration: ' + videoDuration);
    this.set('videoDuration', videoDuration);
  }


  /**
   * Go to 30 seconds
   */
  public goToTime() {
    try {
      this._videoPlayer.seekToTime(30000);
    } catch (err) {
      console.log(err);
    }
  }


  public muteVideo() {
    this._videoPlayer.mute(true);
  }

  public unmuteVideo() {
    this._videoPlayer.mute(false);
  }


  /**
   * Get the video current time
   */
  public getVideoCurrentTime() {
    try {
      let currentTime = this._videoPlayer.getCurrentTime();
      console.log('Current Time: ' + currentTime);
    } catch (err) {
      console.log(err);
    }
  }



  // /**
  //  * Change the video src property
  //  */
  // public changeVideoSource() {
  //   if (this.videoSrc === '~/videos/big_buck_bunny.mp4') {
  //     this._videoPlayer.src = 'https://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4';
  //     this.set('videoSrc', 'https://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4')
  //   } else {
  //     this._videoPlayer.src = '~/videos/big_buck_bunny.mp4';
  //     this.set('videoSrc', '~/videos/big_buck_bunny.mp4')
  //   }
  // }



  private trackVideoCurrentPosition(): number {
    // if (isAndroid) {
    let trackInterval = setInterval(() => {
      var x = this._videoPlayer.getCurrentTime();
      this.set('currentTime', x);
    }, 200);
    return trackInterval;
    // }

  }


  playerCallback(e) {
    console.log("asdf0", this._videoPlayer)
    console.log("asdf0", this._videoPlayer.width)
    console.log("asdf1", this._videoPlayer.height)
    console.log("asdf2", this._videoPlayer.android)
    console.log("asdf3", this._videoPlayer.android.src)
    // var vidSource = fromFile(this.videoLink)
    console.log("asdf4", e)
    // console.log("asdf5", JSON.stringify(e)) // this gives "converting circular structure to JSON" error
    console.log("asdf6", e.width) // this gives just [object Object]


    if (application.android) {
      var metaRetriever = new android.media.MediaMetadataRetriever();
      metaRetriever.setDataSource(this._videoPlayer.android.src);
      var height = metaRetriever.extractMetadata(android.media.MediaMetadataRetriever.METADATA_KEY_VIDEO_HEIGHT);
      console.log("____________________", "1", height, width)
      var width = metaRetriever.extractMetadata(android.media.MediaMetadataRetriever.METADATA_KEY_VIDEO_WIDTH);

      var min = Math.min(height, width);
      var rate = this.screenWidth / min
      this.playerWidth = width * rate
      this.playerHeight = height * rate
      this.playerOffsetX = (this.screenWidth - this.playerWidth) / 2
      this.playerOffsetY = (this.screenWidth - this.playerHeight) / 2
      console.log("____________________", "2", this.playerHeight, this.playerWidth)

      // above code did not change UI in runtime so force set properties 
      this._videoPlayer.width = this.playerWidth
      this._videoPlayer.height = this.playerHeight
      this._videoPlayer.marginLeft = this.playerOffsetX
      this._videoPlayer.marginTop = this.playerOffsetY
    }

  }


}