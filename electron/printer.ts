import { exec } from 'child_process'

export class Printer {
  public static list(): Promise<any> {
    return new Promise((resolve, reject) => {
      exec('wmic printer get Name,PrinterStatus', (err, res) => {
        if (err) {
          reject(err)
        }

        const clean_lines = res.replace('\r\r', '').trim().split('\n')

        const lines = clean_lines.reduce<any>((result, current, index) => {
          if (index != 0) {
            const [name, status] = current
              .split(/\s{2,}/g)
              result.push({ name, status })
          }

          return result
        }, [])

        resolve(lines)
      })
    })
  }
}
