import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const DEFAULT_USER_ID = process.env.DEFAULT_USER_ID || "default-user";

export const ourFileRouter = {
  media: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      return { userId: DEFAULT_USER_ID };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
