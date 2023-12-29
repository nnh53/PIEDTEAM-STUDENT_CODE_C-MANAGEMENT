interface IConnection {
  host: string
  port: number
  connectName: string
  connect(): void
}

export default IConnection
