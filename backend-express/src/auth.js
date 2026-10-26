import { ApiError } from "./errors.js";
import { findPublic } from "./users.js";
import jwt from "jsonwebtoken";
// jsonwebtoken은 설치되어 있습니다. 아래 함수의 본문을 구현하세요.

const iss = process.env.JWT_ISSUER;
const aud = process.env.JWT_AUDIENCE;
const RandomKey = process.env.JWT_SECRET;
const exampleKey = "REPLACE_WITH_RANDOM_64_HEX_CHARACTERS";

export function issueToken(user) {
  // TODO BE-01: 서버 환경변수 키로 HS256 JWT 발급. sub, exp, iss, aud 필수.
  const sub = String(user.id);
  const exp = Math.floor(Date.now() / 1000) + Number(process.env.TOKEN_TTL || 90);
  
  if(!RandomKey)
  {
    throw new ApiError(500, "INTERNAL_ERROR", "서버 인증 설정 오류");
  }

  const valid = RandomKey.length === 64 && [...RandomKey].every(c => "0123456789abcdef".includes(c.toLowerCase()))
  if(!valid || RandomKey.toLowerCase() === exampleKey.toLowerCase())
  {
    throw new ApiError(500, "INTERNAL_ERROR", "서버 인증 설정 오류");
  }

  const byteConvert = Buffer.from(RandomKey, "hex");
  const answer = jwt.sign({sub, exp, iss, aud}, byteConvert, {algorithm: "HS256"});
  
  return answer;
}

export function currentUserId(req) {
  // TODO BE-02: Bearer 추출 → 서명/알고리즘/만료/클레임 검증 → 실제 사용자 확인.
  // 완성 후 아래 데모 ID 반환을 제거하세요. 토큰 없음/변조/만료는 401입니다.
  
  const authorization = req.get("Authorization");
  if(!authorization)
  {
    throw new ApiError(401, "TOKEN_REQUIRED", "인증 토큰 필요");
  }

  const bearerHeader = authorization.split(" ")
  if(bearerHeader.length !== 2 || bearerHeader[0].toLowerCase() !== "bearer" || !bearerHeader[1])
  {
    throw new ApiError(401, "TOKEN_REQUIRED", "Bearer 형식 오류");
  }

  const token = bearerHeader[1];
  const key = Buffer.from(RandomKey, "hex");
  let payload;

  try {
    payload = jwt.verify(token, key, {algorithms: ["HS256"], issuer: iss, audience: aud});
  }
  catch(error)
  {
    if (error.name === "TokenExpiredError")
    {
      throw new ApiError(401,"TOKEN_EXPIRED","정상 서명의 토큰이 만료");
    }
    throw new ApiError(401, "INVALID_TOKEN", "변조·서명·클레임 오류·없는 사용자")
  }

  if(!payload || typeof payload !== "object" ||
    typeof payload.exp !== "number" ||
    typeof payload.iss !== "string" ||
    typeof payload.aud !== "string" ||
    typeof payload.sub !== "string" ||
    !/^[1-9]\d*$/.test(payload.sub) ||
    !Number.isSafeInteger(Number(payload.sub))
  )
  {
    throw new ApiError(401, "INVALID_TOKEN", "변조·서명·클레임 오류·없는 사용자");
  }

  const numberUserId = Number(payload.sub);
  const findUserId = findPublic(numberUserId);

  if(!findUserId)
  {
    throw new ApiError(401,"INVALID_TOKEN", "변조·서명·클레임 오류·없는 사용자")
  }

  return numberUserId; 
}
export function assertOwner(userId, authorId) {
  // TODO BE-03: 다른 작성자이면 403 FORBIDDEN. 현재는 검사하지 않습니다.

  if(userId !== authorId)
  {
    throw new ApiError(403, "FORBIDDEN", "인증한 사용자가 다른 사람 글을 변경")
  }

  return true;
}
