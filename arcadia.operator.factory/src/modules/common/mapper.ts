export abstract class Mapper<T, R> {
  abstract map(data: T): R;
}