import { BASE_ANIMATIONS_PATH } from './constants';

// TODO: Complete all types

export function calculateBounds(skeleton: any) {
  skeleton.setToSetupPose();
  skeleton.updateWorldTransform();

  const offset = new spine.Vector2();
  const size = new spine.Vector2();

  skeleton.getBounds(offset, size, []);

  return {
    offset,
    size,
  };
}

export function loadSkeleton(assetManager: spine.AssetManager, name: string, skin = 'default') {
  // Load the texture atlas using name.atlas and name.png from the AssetManager.
  // The function passed to TextureAtlas is used to resolve relative paths.
  const atlas = new spine.TextureAtlas(assetManager.get(`${BASE_ANIMATIONS_PATH}${name}.atlas`), (path) => (
    assetManager.get(`${BASE_ANIMATIONS_PATH}${path}`)
  ));

  // Create a AtlasAttachmentLoader, which is specific to the WebGL backend.
  const atlasLoader = new spine.AtlasAttachmentLoader(atlas);

  // Create a SkeletonJson instance for parsing the .json file.
  const skeletonJson = new spine.SkeletonJson(atlasLoader);

  // Set the scale to apply during parsing, parse the file, and create a new skeleton.
  const skeletonData = skeletonJson.readSkeletonData(assetManager.get(`${BASE_ANIMATIONS_PATH}${name}.json`));
  const skeleton = new spine.Skeleton(skeletonData);

  skeleton.scaleY = -1;

  const bounds = calculateBounds(skeleton);

  skeleton.setSkinByName(skin);

  // Create an AnimationState, and set the initial animation in looping mode.
  const animationState = new spine.AnimationState(new spine.AnimationStateData(skeleton.data));

  // Pack everything up and return to caller.
  return {
    skeleton,
    bounds,
    animationState,
  };
}

export const preloadAnimationsResources = (skeletonNames: string[]) => {
  const assetManager = new spine.canvas.AssetManager();

  const promises = skeletonNames.map((skeletonName) => Promise.all([
    new Promise((resolve, reject) => assetManager.loadText(`${BASE_ANIMATIONS_PATH}${skeletonName}.json`, resolve, reject)),
    new Promise((resolve, reject) => assetManager.loadText(`${BASE_ANIMATIONS_PATH}${skeletonName}.atlas`, resolve, reject)),
    new Promise((resolve, reject) => assetManager.loadTexture(`${BASE_ANIMATIONS_PATH}${skeletonName}.png`, resolve, reject)),
  ]));

  return Promise.all(promises);
};
