import { Resolver, Mutation, Arg, Authorized } from 'type-graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload-ts';
import { File } from '../types/File';
import { uploadToS3 } from '../utils/s3';

@Resolver()
export class ImageResolver {
  @Authorized()
  @Mutation(() => File)
  async chargePartner(
    @Arg('image', () => GraphQLUpload) image: Promise<FileUpload>
  ): Promise<File> {
    const { createReadStream, filename, mimetype, encoding } = await image;
    const stream = createReadStream();

    const url = await uploadToS3(stream, mimetype, filename);

    return { filename, mimetype, encoding, url };
  }
}
