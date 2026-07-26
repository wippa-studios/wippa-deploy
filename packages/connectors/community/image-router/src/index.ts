import { createConnector } from "@wippa/connectors-framework";
import { imageRouterAuth } from "./lib/common/auth";
import { PieceCategory } from '@wippa/connectors-framework';
import { createImage } from "./lib/actions/create-image";
import { imageToImage } from "./lib/actions/image-to-image";

export const imageRouter = createConnector({
  displayName: "ImageRouter",
  auth: imageRouterAuth,
  minimumSupportedRelease: '0.36.1',
  categories: [PieceCategory.ARTIFICIAL_INTELLIGENCE],
  description: "Generate images with any model available on ImageRouter.",
  logoUrl: "https://cdn.activepieces.com/pieces/image-router.png",
  authors: ["onyedikachi-david"],
  actions: [
    createImage,
    imageToImage,
  ],
  triggers: [],
});
