declare module 'webgazer' {
  type Tracker = unknown
  type TrackerModule = { new (): Tracker }
  type Regression = unknown

  type EyeFeature = {
    patch: ImageData
    imagex: number
    imagey: number
    width: number
    height: number
  }
  type EyeFeatures = {
    left: EyeFeature
    right: EyeFeature
  }
  type Prediction = {
    x: number
    y: number
  }
  type GazeData = {
    x: number
    y: number
    eyeFeatures: EyeFeatures
  }
  type GazeDataAll = GazeData & {
    all: Prediction[]
  }

  type GazeListener = (latestGazeData: GazeDataAll, elapsedTime: number) => void

  type WebGazer = {
    /**
     * Starts all state related to webgazer -> dataLoop, video collection, click listener
     * If starting fails, call `onFail` param function.
     */
    begin(onFail?: () => void): Promise<WebGazer>
    /**
     * Checks if webgazer has finished initializing after calling begin()
     * [20180729 JT] This seems like a bad idea for how this function should be implemented.
     * @returns if webgazer is ready
     */
    isReady(): boolean
    /**
     * Stops collection of data and predictions
     */
    pause(): WebGazer
    /**
     * Resumes collection of data and predictions if paused
     */
    resume(): WebGazer
    /**
     * stops collection of data and removes dom modifications, must call begin() to reset up
     */
    end(): WebGazer
    /**
     * Stops the video camera from streaming and removes the video outlines
     */
    stopVideo(): WebGazer
    /**
     * Returns if the browser is compatible with webgazer
     * @return if browser is compatible
     */
    detectCompatibility(): boolean
    /**
     * Set whether to show any of the video previews (camera, face overlay, feedback box).
     * If true: visibility depends on corresponding params (default all true).
     * If false: camera, face overlay, feedback box are all hidden
     */
    showVideoPreview(val: boolean): WebGazer
    /**
     * Set whether the camera video preview is visible or not (default true).
     */
    showVideo(val: boolean): WebGazer
    /**
     * Set whether the face overlay is visible or not (default true).
     */
    showFaceOverlay(val: boolean): WebGazer
    /**
     * Set whether the face feedback box is visible or not (default true).
     */
    showFaceFeedbackBox(val: boolean): WebGazer
    /**
     * Set whether the gaze prediction point(s) are visible or not.
     * Multiple because of a trail of past dots. Default true
     */
    showPredictionPoints(val: boolean): WebGazer
    /**
     * Set whether previous calibration data (from localforage) should be loaded.
     * Default true.
     *
     * NOTE: Should be called before webgazer.begin() -- see www/js/main.js for example
     */
    saveDataAcrossSessions(val: boolean): WebGazer
    /**
     * Set whether a Kalman filter will be applied to gaze predictions (default true);
     */
    applyKalmanFilter(val: boolean): WebGazer
    /**
     * Define constraints on the video camera that is used. Useful for non-standard setups.
     * This can be set before calling webgazer.begin(), but also mid stream.
     *
     * @param constraints Example constraints object:
     * { width: { min: 320, ideal: 1280, max: 1920 }, height: { min: 240, ideal: 720, max: 1080 }, facingMode: "user" };
     *
     * Follows definition here:
     * https://developer.mozilla.org/en-US/docs/Web/API/Media_Streams_API/Constraints
     *
     * Note: The constraints set here are applied to the video track only. They also _replace_ any constraints, so be sure to set everything you need.
     * Warning: Setting a large video resolution will decrease performance, and may require
     */
    setCameraConstraints(constraints: MediaTrackConstraints): Promise<void>
    /**
     * Set a static video file to be used instead of webcam video
     */
    setStaticVideo(videoLoc: string): WebGazer
    /**
     * Set the size of the video viewer
     */
    setVideoViewerSize(w: number, h: number): void
    /**
     * Add the mouse click and move listeners that add training data.
     */
    addMouseEventListeners(): WebGazer
    /**
     * Remove the mouse click and move listeners that add training data.
     */
    removeMouseEventListeners(): WebGazer
    /**
     *  Records current screen position for current pupil features.
     *  @param x - position on screen in the x axis
     *  @param y - position on screen in the y axis
     *  @param eventType - "click" or "move", as per eventTypes
     */
    recordScreenPosition(x: string, y: string, eventType: string): WebGazer
    /*
     * Stores the position of the fifty most recent tracker preditions
     */
    storePoints(x: number, y: number, k: number)
    /**
     * Sets the tracking module
     * @param name - The name of the tracking module to use
     */
    setTracker(name: string): WebGazer
    /**
     * Sets the regression module and clears any other regression modules
     * @param name - The name of the regression module to use
     */
    setRegression(name: string): WebGazer
    /**
     * Adds a new tracker module so that it can be used by setTracker()
     * @param name - the new name of the tracker
     * @param constructor - the constructor of the curTracker object
     */
    addTrackerModule(name: string, constructor: TrackerModule): void
    /**
     * Adds a new regression module to the list of regression modules, seeding its data from the first regression module
     */
    addRegression(name: string): WebGazer
    /**
     * Sets a callback to be executed on every gaze event (currently all time steps)
     * @param listener - The callback function to call (it must be like function(data, elapsedTime))
     */
    setGazeListener(listener: GazeListener): WebGazer
    /**
     * Removes the callback set by setGazeListener
     */
    clearGazeListener(): WebGazer
    /**
     * Set the video element canvas; useful if you want to run WebGazer on your own canvas (e.g., on any random image).
     * @return The current video element canvas
     */
    setVideoElementCanvas(canvas: HTMLCanvasElement): HTMLCanvasElement
    /**
     * Clear data from localforage and from regs
     */
    clearData(): Promise<void>
    /**
     * Returns the tracker currently in use
     * @return an object following the tracker interface
     */
    getTracker(): Tracker
    /**
     * Returns the regression currently in use
     * @return an array of regression objects following the regression interface
     */
    getRegression(): Regression[]
    /**
     * Requests an immediate prediction
     * @return prediction data object
     */
    getCurrentPrediction(regIndex?: number): GazeData
    /**
     * Get the video element canvas that WebGazer uses internally on which to run its face tracker.
     * @return The current video element canvas
     */
    getVideoElementCanvas(): HTMLCanvasElement
    /**
     * @return [a,b] where a is width ratio and b is height ratio
     */
    getVideoPreviewToCameraResolutionRatio(): [number, number]
    /*
     * Gets the fifty most recent tracker predictions
     */
    getStoredPoints(): [number[], number[]]
  }

  declare const webgazer: WebGazer
  export default webgazer
}
