import { right, left } from "fp-ts/lib/Either"
import { pipe } from "fp-ts/lib/function"
import { fold, map } from "fp-ts/lib/Option"
import { getBushByName, removeBush } from "../utils/dbController"
export class Kektus {
  static removeBush(growRoomId: number, bushName: string) {
    return pipe(
      getBushByName(growRoomId, bushName),
      map(bush => removeBush(bush.id)),
      fold(
        () => left(`Can't find ${bushName}`),
        () => right('The plant has been removed')
      )
    )
  }

}
