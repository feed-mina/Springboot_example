package kr.so.controller;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import kr.so.mvc.service.CommonService;
import kr.so.util.CommonResponse;
import kr.so.util.UserParam;

@Api(tags = "알림", description = "알림 관리")
@RestController
@RequestMapping("/alarm")
public class AlarmController {
	@Autowired
	CommonService commonService;

	/**
	 * 모든 알람 리스트
	 *
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	@PostMapping(value = "/selectAlarmList.api")
	@ApiOperation(value = "모든 알람 리스트 출력", notes = "현재 DB에 저장된 모든 알람 리스트를 출력합니다.")
	@ApiImplicitParam(name = "paramMap", value = "", required = true, dataTypeClass = String.class)
	public ResponseEntity<?> selectAlarmList(@UserParam Map<String, Object> paramMap) throws Exception {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				commonService.selectPaging("alarm.selectAlarmPaging", paramMap));
	}

	/**
	 * 단일 리스트
	 *
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	@PostMapping(value = "/selectAlarmOneDeatil.api")
	/*
	 * @ApiOperation(value = "단일 알람 리스트 출력", notes = "Param으로 받은 단일 알람을 출력합니다.")
	 * 
	 * @ApiImplicitParam( name = "paramMap", value =
	 * "{\"alarm_seq\":\"ALARM_00000002\"}" , example =
	 * "{\"alarm_seq\":\"ALARM_00000002\"}" , required = true, dataTypeClass =
	 * String.class )
	 */
	public ResponseEntity<?> selectAlarmDetail(@UserParam Map<String, Object> paramMap) throws Exception {
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				commonService.selectMap("alarm.selectAlarmOneDetail", paramMap));
	}

	/**
	 * 알림 발송 알림 insert
	 *
	 * @param paramMap
	 * @return
	 * @throws Exception
	 */
	@PostMapping(value = "/insertAlarm.api")
	/*
	 * @ApiOperation(value = "알람 발송 및 저장", notes = "Param으로 받은 값을 알람 보냅니다.")
	 * 
	 * @ApiImplicitParam( value = "{\n" +
	 * "  \"alarmCatrgory\" : \"ALARM_CATEGORY_03\",\n" +
	 * "  \"alarmForm\" : \"[A,P,M]\",\n" +
	 * "  \"alarmTarget\" : \"TJ,FF,ETC,SA,G\",\n" +
	 * "  \"alarmType\" : \"ALATE_TYPE_04\",\n" + "  \"msg\" : \"테스트\"\n" + "}",
	 * example = "{\n" + "  \"alarmCatrgory\" : \"ALARM_CATEGORY_03\",\n" +
	 * "  \"alarmForm\" : \"[A,P,M]\",\n" +
	 * "  \"alarmTarget\" : \"TJ,FF,ETC,SA,G\",\n" +
	 * "  \"alarmType\" : \"ALATE_TYPE_04\",\n" + "  \"msg\" : \"테스트\"\n" + "}",
	 * required = true, dataTypeClass = String.class)
	 */
	public ResponseEntity<?> insertAlarm(@UserParam Map<String, Object> paramMap) throws Exception {
	//	alarmService.insertAlarm(paramMap);
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
	}

	// 알람 테스트 시작
	// 단일 알람
	@PostMapping(value = "/testAlarm.api")
	@ApiOperation(value = "sendAlarm 테스트", notes = "sendAlram 테스트 API")
	@ApiImplicitParam(name = "paramMap", value = "{\"user_email\":\"kjh@musicen.com\",\n"
			+ "\"alarmFrom\":\"ALARM_PUSH\",\n" + "\"alarmType\":\"PUSH001\",\n" + "\"category\":\"강의\",\n"
			+ "\"title\":\"강의 시작 10분전\",\n"
			+ "\"msg\":\"\b앱으로 들어와 강의 진행해주세요.\"}", example = "{\"user_email\":\"kjh@musicen.com\",\n"
					+ "\"alarmFrom\":\"ALARM_PUSH\",\n" + "\"alarmType\":\"PUSH001\",\n" + "\"category\":\"강의\",\n"
					+ "\"title\":\"강의 시작 10분전\",\n"
					+ "\"msg\":\"강의 시작합니다.\"}", required = true, dataTypeClass = String.class)
	public ResponseEntity<?> testAlarm(@UserParam Map<String, Object> paramMap, HttpServletRequest req)
			throws Exception {

		Map<String, Object> pushMap = commonService.selectMap("fcm.selectUserData", paramMap);
		paramMap.put("userSeq", pushMap.get("userSeq"));

		commonService.insert("alarm.insertAlarm", paramMap);

		String from = (String) paramMap.get("alarmFrom");
/*
		if ("ALARM_PUSH".equals(from)) {
			fcmService.sendTargetMessage((String) pushMap.get("deviceToken"), (String) paramMap.get("title"),
					(String) paramMap.get("msg"), (String) pushMap.get("appOs"), pushMap);
		}
		*/
		// 이메일
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK, pushMap);
	}

	// 유저별 알림함 리스트
	@PostMapping(value = "/selecUserAlarm.api")
	@ApiOperation(value = "sendAlarm 테스트", notes = "sendAlram 테스트 API userSeq 필요")
	public ResponseEntity<?> selecUserAlarm(@UserParam Map<String, Object> paramMap, HttpServletRequest req)
			throws Exception {

		return CommonResponse.statusResponse(HttpServletResponse.SC_OK,
				commonService.selectList("alarm.selecUserAlarm", paramMap));
	}

	// 유저별 알림체크하기
	@PostMapping(value = "/updateUserAlarmCheck.api")
	@ApiOperation(value = "sendAlarm 테스트", notes = "sendAlram 테스트 API userSeq 필요")
	public ResponseEntity<?> updateUserAlarmCheck(@UserParam Map<String, Object> paramMap, HttpServletRequest req)
			throws Exception {
		commonService.selectList("alarm.updateUserAlarmCheck", paramMap);
		return CommonResponse.statusResponse(HttpServletResponse.SC_OK);
	}
}
