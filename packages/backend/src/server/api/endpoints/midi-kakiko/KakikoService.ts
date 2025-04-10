import { Injectable } from '@nestjs/common';
import { spawnSync } from "child_process";
import * as path from "path";

@Injectable()
export class KakikoService {
	exec(mml:string): string|null {
		// 文字列としてMMLを受け取り、それをPythonに投げる
		// 戻り値は生成できたファイル
		let ret = spawnSync("./src/server/api/endpoints/midi-kakiko/.venv/bin/python", ["./src/server/api/endpoints/midi-kakiko/midi_kakiko.py", mml]);
		if (ret.status != 0) {
			return null;
		}

		// ファイル名を受け取る
		// 最後に改行されちゃっているので取り除く
		let file : string = ret.stdout.toString();
		console.log(file.replace("\n", ""));

		return file.replace("\n", "");
	}

}