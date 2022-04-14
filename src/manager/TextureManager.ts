import { Texture2D } from "oasis-engine";
interface TextureFileListType {
  [key: string]: {
    path: string;
    texture: Texture2D | null;
  };
}

const files = import.meta.globEager<{ default: string }>(
  "/public/models/texture/*"
);

/**
 * 纹理管理类
 */
export class TextureManager {
  static defaultTextures: TextureFileListType = {};
  /**
   *
   */
  static changeTexture() {}
}

for (let x in files) {
  TextureManager.defaultTextures[
    x.slice(x.lastIndexOf("/") + 1, x.lastIndexOf("."))
  ] = {
    path: x.replace("/public", "."),
    texture: null,
  };
}
