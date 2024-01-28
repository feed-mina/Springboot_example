package kr.so;

import java.util.Calendar;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
// 스케줄러 기능 추가 (2023.06.08)
@Component
public class ExampleScheduler {

	Logger logger = LoggerFactory.getLogger(getClass());

	// 로컬, 개발 서버에서는 30초마다 설정이 필요하고 운영서버에서는 20초에 1번 돌리게 할 수 있다면?
	// cron에 30초마다 작동하게 설정하였습니다.
	@Scheduled(cron = "#{@schedulerCronExample1}")
	public void schedule1() {
		logger.info("schedule1 동작하고 있음 : {}", Calendar.getInstance().getTime());
	}

}
