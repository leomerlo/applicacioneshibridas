declare module 'JSONStream' {
  export function parse(pattern: string): NodeJS.ReadWriteStream;
}

declare module 'JSONStream/lib/JSONStream' {
  import { Stream } from 'stream';

  function JSONStream(pattern: string): NodeJS.ReadWriteStream;
  namespace JSONStream {
    function parse(pattern: string): NodeJS.ReadWriteStream;
  }

  export = JSONStream;
}