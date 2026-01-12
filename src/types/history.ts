export type HistoryDTO = {
  id: string;
  createdAt: string;
  title: string;
  time: number;
};

export class History {
  public readonly id: string;
  public readonly createdAt: Date;
  public readonly title: string;
  public readonly time: number | "";

  constructor(id: string, createdAt: Date, title: string, time: number | "") {
    this.id = id;
    this.createdAt = createdAt;
    this.title = title;
    this.time = time;
  }

  static from(dto: HistoryDTO): History {
    return new History(dto.id, new Date(dto.createdAt), dto.title, dto.time);
  }

  get createdAtLabel(): string {
    const year = this.createdAt.getFullYear();
    const month = String(this.createdAt.getMonth() + 1).padStart(2, "0");
    const day = String(this.createdAt.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  }
}
