export interface LivePhotoOptions {
  /** The photo's URL. */
  photo: string;
  /** The depth map's URL: a grey mask of the food (white = food) with the photo's framing. */
  depth: string;
  /** The photo's framing (any resolution with this aspect ratio works). Default 1600 x 1143. */
  width?: number;
  height?: number;
  /** Alternative text of the photo. */
  alt?: string;
}

export interface LivePhoto {
  /** Stops the animation, removes the listeners, the WebGL contexts and the elements it added. */
  destroy(): void;
}

export function mountLivePhoto(container: HTMLElement, options: LivePhotoOptions): LivePhoto;
