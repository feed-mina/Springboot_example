package kr.so.configuration;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import kr.so.mvc.domain.BaseCodeLabelEnum;

// JSON 변환 시 BaseCodeLabelEnum 클래시에 대한 변환을 동일하게 처리
/* Enum 장점
 1. 불필요한 테이블 및 코드관리가 필요없어진다.
2. 리스트, 상세 조회시 코드에 대한 코드명을 TABLE 로  JOIN하거나 FUNCTION을 가져오는 불필요한 쿼리가 없어진다.
3. Front(JSP, Vue.js, React, Native APP), API등 에서 코드명 하드코딩이 없어진다. 
4. 위 3개는 즉 결과 나오는 속도가 더 빨라진다. (자동 성능 튜닝...^^)
5. 코드, 코드명 추가/수정/삭제 시 운영서버에 배포만한다면 DB를 직접 건드리지않고 자동으로 적용된다.
6. int, String으로 선언한다면 코드에 대해 공백, 자리수, 유효한 값인지 체크 로직이 들어가야한다. enum은 안해도 된다.
	(Enum에 해당하지 않는 값이 들어온다면 Spring 에서 에러가 발생)
	
* Enum 단점
1. 사이트 관리자 및 고객사에서 오픈 이후 코드를 추가, 수정, 삭제가 불가능 하다.
2. 코드 추가/수정/삭제는 개발자가 직접 코드를 수정하고 운영서버에 배포하고 재기동을 해야 적용된다.
3. DBMS TOOL에서 직접 INSERT, UPDATE 등을 통하여 잘못된 ENUM 정의되지 않은 코드가 있는경우 오류가 발생한다.
*
**/


public class BaseCodeLabelEnumJsonSerializer extends JsonSerializer<BaseCodeLabelEnum>{

	@Override
	public void serialize(BaseCodeLabelEnum value, JsonGenerator jsonGenerator, SerializerProvider provider) throws IOException, JsonProcessingException{
		Map<String, Object> map = new HashMap<>();
		map.put("code", value.code());
		map.put("label", value.label());
		jsonGenerator.writeObject(map);
		
	}
	
}
