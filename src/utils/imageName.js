import { v4 as uuidv4 } from "uuid";
export default function (mimetype) {
  return `${uuidv4()}.${mimetype.split("/").at(-1)}`;
}
