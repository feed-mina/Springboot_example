package kr.so.java.mvc.controller;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import kr.so.java.configuration.exception.BaseException;
import kr.so.java.configuration.http.BaseResponse;
import kr.so.java.configuration.http.BaseResponseCode;
import kr.so.java.framework.data.domain.PageRequest;
import kr.so.java.framework.data.domain.PageRequestParameter;
import kr.so.java.framework.data.web.RequestConfig;
import kr.so.java.mvc.domain.Board;
import kr.so.java.mvc.domain.MenuType;
import kr.so.java.mvc.parameter.BoardParameter;
import kr.so.java.mvc.parameter.BoardSearchParameter;
import kr.so.java.mvc.service.BoardService;

@Controller
// @RequestMapping("/board")
@Api(tags = "게시판 Api")
public class BoardController {
	Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private BoardService boardService;

	// @ResponseBody
	// @ApiOperation(value = "목록 조회", notes = "게시물 정보를 조회할 수 있씁니다.")
	/*
	 * @GetMapping("/list") public BaseResponse<List<Board>> list(
	 * 
	 * @ApiParam BoardSearchParameter parameter,
	 * 
	 * @ApiParam PageRequest pageRequest, Model model) {
	 * 
	 * logger.info("pageRequest : {}", pageRequest);
	 * PageRequestParameter<BoardSearchParameter> pageRequestParameter = new
	 * PageRequestParameter<BoardSearchParameter>( pageRequest, parameter);
	 * 
	 * List<Board> boardList = boardService.getList(pageRequestParameter);
	 * model.addAttribute("boardList", boardList); return new
	 * BaseResponse<List<Board>>(boardService.getList(pageRequestParameter)); }
	 * 
	 */

	
	@GetMapping("/list")
	public void list(BoardSearchParameter parameter, PageRequest pageRequest, Model model) {
		logger.info("pageRequest : {}", pageRequest);
		PageRequestParameter<BoardSearchParameter> pageRequestParameter = new PageRequestParameter<BoardSearchParameter>(
				pageRequest, parameter);

		List<Board> boardList = boardService.getList(pageRequestParameter);
		model.addAttribute("boardList", boardList);
	}

	// 상세페이지


	@GetMapping("/{menuType}")
	public String list(@PathVariable MenuType menuType, BoardSearchParameter parameter, PageRequest pageRequest, Model model) {
		logger.info("pageRequest : {}", pageRequest);
		PageRequestParameter<BoardSearchParameter> pageRequestParameter = new PageRequestParameter<BoardSearchParameter>(
				pageRequest, parameter);

		List<Board> boardList = boardService.getList(pageRequestParameter);
		model.addAttribute("boardList", boardList);
		return "/board/list";
	}


	
	@GetMapping("/detail/{boardSeq}")
	public String detail(@PathVariable int boardSeq, Model model) {
		Board board = boardService.get(boardSeq);
		if (board == null) {
			throw new BaseException(BaseResponseCode.DATA_IS_NULL, new String[] { "게시물" });
		}
		model.addAttribute("board", board);
		return "/board/detail";
	}
	// 등록 화면
	
	@GetMapping("/form")
	@RequestConfig(loginCheck = false)
	public void form(BoardParameter parameter, Model model) {
		model.addAttribute("parameter", parameter);

	}


	
	// 수정화면
	
	@GetMapping("/edit/{boardSeq}")
	@RequestConfig(loginCheck = false)
	public String edit(@PathVariable(required = true) int boardSeq, BoardParameter parameter,  Model model) {

		Board board = boardService.get(parameter.getBoardSeq());
		if(board == null) {
			throw new BaseException(BaseResponseCode.DATA_IS_NULL, new String[] { "게시물" });
			
		}
		model.addAttribute("board", board);
		model.addAttribute("parameter", parameter);
		return "/board/form";
	}


	

	// 등록 화면
	@PostMapping("/save")
	@RequestConfig(loginCheck = false)
	@ResponseBody
	@ApiOperation(value = "등록 / 수정 처리", notes = "신규 게시물 저장 및 기존 게시물 업데이트가 가능합니다.")
	@ApiImplicitParams({ @ApiImplicitParam(name = "boardSeq", value = "게시물 번호", example = "1"),
			@ApiImplicitParam(name = "title", value = "제목", example = "Spring"),
			@ApiImplicitParam(name = "contents", value = "내용", example = "Spring 글"), })

	public BaseResponse<Integer> save(BoardParameter parameter) {
		// 제목 필수 체크
		if (StringUtils.isEmpty(parameter.getTitle())) {
			throw new BaseException(BaseResponseCode.VALIDATE_REQUIRED, new String[] { "title", "게시물" });
		}

		// 내용 필수 체크
		if (StringUtils.isEmpty(parameter.getContents())) {
			throw new BaseException(BaseResponseCode.VALIDATE_REQUIRED, new String[] { "contents", "게시물" });
		}

		boardService.save(parameter);
		return new BaseResponse<Integer>(parameter.getBoardSeq());
	}

// 대용량 등록 처리

	@ApiOperation(value = "대용량등록처리1", notes = "대용량 등록처리1")
	@PutMapping("/saveList1")
	public BaseResponse<Boolean> saveList1() {
		int count = 0;
		// 텍스트를 한꺼번에 10000개 저장
		List<BoardParameter> list = new ArrayList<BoardParameter>();
		while (true) {
			count++;
			String title = RandomStringUtils.randomAlphabetic(10);
			String contents = RandomStringUtils.randomAlphabetic(10);
			list.add(new BoardParameter(title, contents));
			if (count >= 10000) {
				break;
			}
		}

		long start = System.currentTimeMillis();
		boardService.saveList1(list);
		long end = System.currentTimeMillis();
		logger.info("실행시간 : {}", (end - start) / 1000.0);
		return new BaseResponse<Boolean>(true);
	}

	@PutMapping("/saveList2")
	@ApiOperation(value = "대용량 등록처리2", notes = "대용량 등록처리2")
	public BaseResponse<Boolean> saveList2() {
		int count = 0;
		// 테스트를 위한 랜덤 1000건의 데이터를 생성
		List<BoardParameter> list = new ArrayList<BoardParameter>();
		while (true) {
			count++;
			String title = RandomStringUtils.randomAlphabetic(10);
			String contents = RandomStringUtils.randomAlphabetic(10);
			list.add(new BoardParameter(title, contents));
			if (count >= 10000) {
				break;
			}
		}

		long start = System.currentTimeMillis();
		boardService.saveList2(list);
		long end = System.currentTimeMillis();
		logger.info("실행시간 : {}", (end - start) / 1000.0);
		return new BaseResponse<Boolean>(true);

	}

	@DeleteMapping("/{boardSeq}")
	@ApiOperation(value = "삭제 처리", notes = "게시물을 삭제합니다.")
	@ApiImplicitParams({ @ApiImplicitParam(name = "boardSeq", value = "게시물 번호", example = "1"), })

	public BaseResponse<Boolean> delete(@PathVariable int boardSeq) {
		Board board = boardService.get(boardSeq);
		if (board == null) {
			return new BaseResponse<Boolean>(false);
		}
		boardService.delete(boardSeq);
		return new BaseResponse<Boolean>(true);
	}

}
