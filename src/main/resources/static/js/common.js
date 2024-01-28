/*****************************************************************************
 *
 * common.js
 * 공통 스크립트
 *
 */
const gServerApiUrl = "";

const JITSI_PROD = "schjit.musicen.com";
const JITSI_DEV = "jit-si.musicen.com";
let NODE_URL = ""; // "https://schback2.musicen.com";

let JITSI_URL = "";
if(location.hostname === "schback2.musicen.com"){
	JITSI_URL = JITSI_PROD
}else{
	JITSI_URL = JITSI_DEV
}

$(document).ready(function() {

	// 헤더가 있는 페이지는 헤더, 사이드바 공통 세팅
	/*
	[1]
	페이지 header <header id="header-html"></header> 부분,
	sidePath 는 목차를 의미
	*/
	if($("#header-html").length){
		var path = window.location.pathname;
		var pathArray = path.split("/");
		var headPath ="/include/header.html";
		var sidePath = "/include/sidebar.html";
		var sidebarCategory = pathArray[3]; // string : board, dashboard, consult, sysManage, userManage 등등
		$.when(
			$.get(headPath, function(data) {
				$("#header-html").html(data);
				$("#h_admin_nm").text(util.getUserEmail());
			}),
			$.get(sidePath, function(data) {
				var sidebar = $(data);
				// 예를 들면 id가 #board, #consult 에 맞는 태그의 sidebar만 show함수
				sidebar.find("#" + sidebarCategory).show(); // 카테고리맞는 sidebar만 show
				// html 함수 일치하는 요소 집합에서 각 요소의 HTML 콘텐츠를 설정
				$("#sidebar-html").html(sidebar); 
			})
		).done(function() {
			// sidebar, 헤더 부분 css Active 추가
			const locNm = location.pathname + location.search; // ex '/sch/admin/lctreSemina/lctreSemina.html?name=hi'
			let aTag = $("a[href='" + locNm + "']");
			aTag.closest(".nav-item").addClass("active"); // 사이드바 active추가
			$(".navbar").find("[data-category=" + sidebarCategory + "]").find("a").addClass("active")  // 헤더 active추가 url기준(sidebarCategory)으로 header.html 안의 data-category에 활성화될 카테고리 입력해놓음

			initUserAuth();
			initI18n();
		});
	}

	// [2] 공통 팝업, 모달 등 추가
	$("body")
		.append(
			// scroll to top button
			`<a class="scroll-to-top rounded" href="#page-top"><i class="fas fa-angle-up"></i></a>`
		)
		.append(
			// 공통 Modal
			`
			<div class="modal fade" id="alertCenter" data-backdrop="static" data-keyboard="false" role="dialog">
			<div class="modal-dialog modal-dialog-centered" role="modal">
				<div class="modal-content shadow-lg">
				<div class="modal-header">
					<h5 class="modal-title" id="alertTitle">Modal title</h5>
					<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body" id="alertContent">...</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-dismiss="modal">취소</button>
					<button type="button" class="btn btn-primary" data-dismiss="modal">확인</button>
				</div>
				</div>
			</div>
			</div>
      `
		)
		.append(
			// 공통 Modal 로딩 스피너
			`
			<div id="loadingSpinner" style="display:none;">
			<div class="spinner-border text-primary" id="globalLoading" role="status">
				<span class="sr-only">Loading...</span>
			</div>
			</div>
      `
		);

		// [3]
	$("#contents").prepend(
		//공통 Toast
		`
		<div style="position: fixed; top: 20px; right: 20px; z-index: 9999">
			<div id="toastAlert" class="toast hide" role="alert" data-delay="3000" style="width:200px;">
			<div class="toast-header">
				<strong class="mr-auto"><span class="text-info">알림</span></strong>
				<button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
				<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="toast-body"></div>
			</div>
		</div>
    `
	);

	//[4]
	// 검색창에서 화살표이미지 on class 토글하기
	search_details();

	// alarmPageList 개설 중간에 좌측 네비게이션 메뉴 및 상단 메뉴 클릭시 alert 띄워준다
	let alarmPageList = ['seminaRegist', 'lctreRegist', 'seminaUpdt', 'lctreUpdt'];
	let url = document.location.href;
	let extensionIndex = url.lastIndexOf(".");
	let startIndex = url.lastIndexOf("/");
	let htmlFileName = url.substring(startIndex+1, extensionIndex);
	let alertTargetPage = ["/lctreSemina", "/dashBoard", "/userManage", "/cnsltExprn", "/alarm", "/board", "/sysManage"];
	if (alarmPageList.includes(htmlFileName)) {
		window.onbeforeunload = function(event) {
			let targetHref = event.target.activeElement.href;
			let targetLastIndex = targetHref.lastIndexOf("/");
			targetHref = targetHref.substr(0, targetLastIndex);
			let targetStartIndex = targetHref.lastIndexOf("/");
			targetHref = targetHref.substr(targetStartIndex, targetHref.length);
			if (alertTargetPage.includes(targetHref)) {
				event.returnValue = '"내용2"';
			}
		}
	}
});

// 권한에따라 헤더 activ조정
var initUserAuth = function(){
	const loginUserAuthor = util.getStorage('userAuthor')
	$.sendAjax({
		url: "/sysManage/selectMberAuthList.api",
		data: {userAuthor: loginUserAuthor},
		contentType: "application/json",
		success : (res) => {
			$("#header-html .nav a.nav-link").each((idx, val) => {
				const id = $(val).data("auth"); // authDashboard
				if(res.data[id] === "N"){
					$(val).addClass("disabled")
				}
			})
		},
		error : (err) => {
			console.log(err);
		}		
	})
}

// 다국어
var initI18n = function(){
	$.i18n.init({
        // lng: 'ko-KR', 
        debug: true,
        useLocalStorage: true,
        localStorageExpirationTime: 86400000, // in ms, default 1 week
        ns: {
            namespaces: ['lnb', 'gnb'],
            defaultNs: 'lnb'
        },
        //resGetPath: 'js/locales/translation.json'
        resStore: {
			"ko-KR": {
                "lnb": {
					// 대시보드
                    "dashboard": "대시보드",

					// 강의세미나
                    "calendar": "일정표",
                    "createLctre": "강의 개설",
                    "operateLctre": "강의 운영",
                    "createSemina": "세미나 개설",
                    "operateSemina": "세미나 운영",
                    "vod": "VOD 관리",

					// 수강생관리
                    "userList": "수강생 리스트",
                    "grade": "등급 선정",

					// 교수상담체험
                    "createCnslt": "교수상담 개설",
                    "operateCnslt": "교수상담 운영",
                    "createExprn": "체험예약 개설",
                    "operateExprn": "체험예약 운영",
                    "suggestExprn": "다른 체험 제안",
                    "gallery": "갤러리 관리",
										"gongjarueManagement" : "공자루 관리",

					// 알림관리
                    "alarmList": "알림 리스트",
                    "sendAlarm": "알림 발송",

					// 게시판
                    "notice": "공지사항",
                    "qna": "Q&A",
                    "faq": "FAQ",
										"gongjarueManagementP" : "공자루 관리",

					// 시스템관리
                    "normalUser": "일반회원 관리",
                    "adminUser": "관리자회원 관리",
                    "blclst": "블랙리스트",
                    "authList": "권한 관리",
                    "accHist": "사용자접속이력",
                },
                "gnb": {
                    "dashboard": "대시보드",
                    "lctre_semina": "강의*세미나",
                    "user": "수강생 관리",
                    "cnslt_exprn": "교수상담*체험예약",
                    "alarm": "알림 관리",
                    "board": "게시판",
                    "system": "시스템 관리",
                }
            },
            "zh-CH": {
                "lnb": {
					// 대시보드
                    "dashboard": "仪表板",
					// 강의세미나
                    "calendar": "日程表",
                    "createLctre": "开设课程",
                    "operateLctre": "讲义运营",
                    "createSemina": "开设研讨会",
                    "operateSemina": "研讨会的运作",
                    "vod": "VOD 管理",

					// 수강생관리
                    "userList": "学员名单",
                    "grade": "等级选定",

					// 교수상담체험
                    "createCnslt": "开设教学咨询",
                    "operateCnslt": "教授咨询运营",
                    "createExprn": "体验预约开设",
                    "operateExprn": "体验预约运营",
                    "suggestExprn": "不同的体验建议",
                    "gallery": "画廊管理",
										"gongjarueManagement" : "孔柄管理",

					// 알림관리
                    "alarmList": "通知单",
                    "sendAlarm": "发送通知",

					// 게시판
                    "notice": "公告",
                    "qna": "Q&A",
                    "faq": "FAQ",
										"gongjarueManagementP" : "孔柄管理",

					// 시스템관리
                    "normalUser": "普通会员管理",
                    "adminUser": "管理员会员管理",
                    "blclst": "黑名单",
                    "authList": "权限管理",
                    "accHist": "用户访问历史",
                },
                "gnb": {
                    "dashboard": "仪表板",
                    "lctre_semina": "讲义*研讨会",
                    "user": "学员管理",
                    "cnslt_exprn": "教授咨询*体验预约",
                    "alarm": "管理通知",
                    "board": "公告栏",
                    "system": "系统管理",
                }
            },
         
        }
    }, function (...wer) {
		$('#header-html').i18n()
		$('#sidebar-html').i18n()

		var isKorea = $.i18n.options.lng === 'ko-KR'; 
		$("#customSwitch1").next("label").text(isKorea ? "한글" : "중국어")
		$("#customSwitch1").prop("checked", isKorea)
		$("#customSwitch1").find("label:before").css("")
    });
}

// 캘린더
var datepicker = function() {
	$.datepicker.setDefaults({
		dateFormat: "yy-mm-dd",
		yearSuffix: "년",
		monthNames: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
		monthNamesShort: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
		dayNamesMin: ["일", "월", "화", "수", "목", "금", "토"],
		showOtherMonths: true,
		showMonthAfterYear: true,
		changeMonth: true,
		changeYear: true,
		nextText: "다음 달",
		prevText: "이전 달",
		viewMode: "months",
		minViewMode: "months",
	});
	$(".datepicker")
		.datepicker()
		.on("change", function() {
			this.dispatchEvent(new Event("input"));
			if ($(this).hasClass("datepicker_from")) {
				$(this).closest(".bx_calendar").find(".datepicker_to").datepicker("option", "minDate", this.value);
			} else if ($(this).hasClass("datepicker_to")) {
				$(this).closest(".bx_calendar").find(".datepicker_from").datepicker("option", "maxDate", this.value);
			}
		});
};

$(document).ajaxStart(function() {
	$("body").css("overflow", "hidden");
	$("#loadingSpinner").show();
});
$(document).ajaxStop(function() {
	$("body").css("overflow", "");
	$("#loadingSpinner").hide();
});
$(document).on("keyup", ".only-phone", function(e) {
	var val = util.formmater.phone($(this).val());
	$(this).val(val);
});

/***************
 * 페이징 공통
 ******************/
var fnPaging = (totalData, dataPerPage, pageCount, currentPage, callBack, loadingYn, elemId) => {
	elemId = !elemId ? "#pagination" : "#" + elemId;
	if (totalData < 1) {
		$(elemId).html("");
		return;
	}

	var totalPage = Math.ceil(totalData / dataPerPage); // 총 페이지 수
	var pageGroup = Math.ceil(currentPage / pageCount); // 페이지 그룹

	var last = pageGroup * pageCount; // 화면에 보여질 마지막 페이지 번호
	var first = last - (pageCount - 1) <= 0 ? 1 : last - (pageCount - 1); // 화면에 보여질 첫번째 페이지 번호
	if (last > totalPage) {
		last = totalPage;
	}

	var html = "";

	html += '<li style="cursor:pointer" id="first" class="page-item"><a class="page-link">&lt;&lt;</a></li>';
	html += '<li style="cursor:pointer" id="prev" class="page-item"><a class="page-link">&lt;</a></li>';

	for (var i = first; i <= last; i++) {
		html += `<li style="cursor:pointer" id="${i}" class="page-item"> <a class="page-link">${i}</a> </li>`;
	}

	html += '<li style="cursor:pointer" id="next" class="page-item"><a class="page-link">&gt;</a></li>';
	html += '<li style="cursor:pointer" id="last" class="page-item"><a class="page-link">&gt;&gt;</a></li>';

	$(elemId).html(html); // 페이지 목록 생성
	$(elemId + " li#" + currentPage).addClass("active"); // 현재 페이지 표시

	$(elemId + " li")
		.off("click")
		.on("click", function() {
			if (loadingYn != null && loadingYn == "Y") {
				$("#loadingDiv").addClass("dimm_load").show();
			}
			var $item = $(this);
			var $id = $item.attr("id");
			var selectedPage = +$item.text();

			if ($id == "first") selectedPage = 1;
			if ($id == "next") selectedPage = last + 1 > totalPage ? totalPage : last + 1;
			if ($id == "prev") selectedPage = first - pageCount <= 0 ? 1 : first - pageCount;
			if ($id == "last") selectedPage = totalPage;

			if (typeof callBack == "function") {
				callBack(selectedPage);
			}

			fnPaging(totalData, dataPerPage, pageCount, selectedPage, callBack, loadingYn, elemId.substring(1));
		});

	if (loadingYn != null && loadingYn == "Y") {
		setTimeout(() => {
			$("#loadingDiv").removeClass("dimm_load").hide();
		}, 20);
	}
};

/* jQuery 공통함수 */
/**
 * $.sendAjax
 */
jQuery.sendAjax = (option) => {
	if (option == null || typeof option != "object" || option.url == null) {
		alert("option type 오류!!!");
		return;
	}

	// 모든 string인자 trim 처리
	if (option.data) {
		Object.keys(option.data).forEach((key) => {
			if (typeof option.data[key] == "string") {
				option.data[key] = $.trim(option.data[key]);
			}
		});
	}

	//error 공통처리
	var paramError = option.error;

	if (option.contentType == "application/json") {
		option.data = JSON.stringify(option.data);
	}

	var lOption = {
		url: gServerApiUrl,
		method: "post",
		headers: { "X-AUTH-TOKEN": util.getToken() },
		global: true,
		success: (res) => { },
	};

	lOption = $.extend({}, lOption, option);
	lOption.url = gServerApiUrl + option.url;

	lOption.error = (error) => {
		// 토큰 secret은 맞으나 db에서 유저가없을때 나오는 에러로 임시로 message구분해서 막음
		if(error.status === 500){
			if(error.responseJSON.message === 'username cannot be null'){
				util.logout(false);
			}
		}
		if (error.status === 401) {
			if (util.getStorage("autoLogin") == true) {
				$.ajax({
					url: "/login/refreshToken.api",
					method: "POST",
					contentType: "application/json",
					data: JSON.stringify({ accessToken: util.getToken() }),
					success: (res) => {
						// alert("자동로그인 하겠습니다");
						util.setStorage("accessToken", res.data.newToken);
						location.reload();
					},
					error: (err) => {
						alert("자동로그인 실패");
						util.logout(false);
					},
				});
				return;
			} else {
				// alert("세션이 만료되었습니다.");
				util.logout(false);
				return;
			}
		}
		if (paramError != null && typeof paramError == "function") {
			paramError(error);
		} else {
			if (error.responseJSON != null && error.responseJSON.message != null) {
				$.alert(error.responseJSON.message);
				return;
			}
			$.alert("일시적인 에러입니다.<br/>잠시후 다시 이용해 주세요.");
			return;
		}
	};

	return $.ajax(lOption);
};

jQuery.confirm = (msg, successCb = null, failCb = null, option = {}, isAlert = false) => {
	!isAlert && $("#alertCenter .btn-secondary").show();

	const options = {
		title: "알림",
		...option,
	};
	$("#alertTitle").text(options.title);
	$("#alertContent").html(msg);

	$("#alertCenter")
		.off("click.alert")
		.on("click.alert", ".btn-primary", function() {
			$("#alertCenter.modal").modal("hide").data("bs.modal", null);
			typeof successCb == "function" && successCb();
		})
		.on("click.alert", ".btn-secondary, .close", function() {
			$("#alertCenter.modal").modal("hide").data("bs.modal", null);
			typeof failCb == "function" && failCb();
		});

	$("#alertCenter").modal();
};
jQuery.alert = (msg, successCb = null, failCb = null, option) => {
	$("#alertCenter .btn-secondary").hide();
	jQuery.confirm(msg, successCb, failCb, option, true);
};
jQuery.closeModal = (modalName = "alertCenter") => {
	$(`#${modalName}`).modal("hide");
};

jQuery.toast = (msg = "", type = "info", title = "알림") => {
	$("#toastAlert strong").html(`<span class="text-${type}">${title}</span>`);
	$("#toastAlert .toast-body").html(msg);
	$("#toastAlert").toast("show");
};

// 공통 유틸 함수
var util = {
	validator: {
		isTelNumber: (tel) => {
			var tt = tel.replace(/-/g, "");
			var regExp = /^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/;
			return regExp.test(tt); // 형식에 맞는 경우 true 리턴
		},
		isEmail: (email) => {
			var regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
			return regExp.test(email); // 형식에 맞는 경우 true 리턴
		},
		isBsnmNo: (number) => {
			var numberMap = number
				.replace(/-/gi, "")
				.split("")
				.map(function(d) {
					return parseInt(d, 10);
				});
			if (numberMap.length == 10) {
				var keyArr = [1, 3, 7, 1, 3, 7, 1, 3, 5];
				var chk = 0;
				keyArr.forEach(function(d, i) {
					chk += d * numberMap[i];
				});
				chk += parseInt((keyArr[8] * numberMap[8]) / 10, 10);
				return Math.floor(numberMap[9]) === (10 - (chk % 10)) % 10;
			}
			return false;
		},

		isSafePW: (str) => {
			if (str.length < 9) return "비밀번호를 최소 9자 이상 입력해주세요";
			if (str.length > 20) return "비밀번호는 최대 20자까지 입력 가능합니다.";

			const special = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g;
			const number = /[0-9]/g;
			const lowerCase = /[a-z]/g;
			const upperCase = /[A-Z]/g;

			const list = [special, number, lowerCase, upperCase];

			const count = list.map((item) => item.test(str)).filter((item) => item === true).length;

			if (count < 3) return "영대문자, 영소문자, 숫자, 특수문자(!, @...) 중 3종류 이상으로 구성해주세요";

			return true;
		},

		// isHour: (hour) => {
		//   const special = /[0-9]/g;
		// }
		isEmpty: (param) => {
			if (param.length === 0 || param === "" || param.replaceAll(" ", "") === "") {
				return true;
			} else {
				return false;
			}
		},

		isNotEmpty: (param) => {
			if (param !== "" && param !== undefined && param !== null) {
				return true;
			} else {
				return false;
			}
		},

		isSearchKeyword: (e, maxKeywordNum) => {
			if (util.validator.isEmpty(e.target.value)) {
				e.target.value = "";
				return false;
			}
			let keyword = $(".keyword");

			for (let i = 0; i < keyword.length; i++) {
				if (e.target.value === keyword[i].innerText) {
					if ($("#cantAdd").length === 0) {
						$("#message").append("<span id='cantAdd'>&nbsp;&nbsp;&nbsp;* 동일 키워드는 입력이 불가능합니다.</span>");
					}
					return false;
				}
			}

			$("#cantAdd").remove();

			if (keyword.length >= maxKeywordNum) {
				return false;
			}
			return true;
		},
	},

	date: {
		formatDateToYYYYMMDD(date) {
	const year = date.getFullYear().toString(); // 끝에서 두 자리를 잘라내는 부분을 제거
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const day = date.getDate().toString().padStart(2, '0');

	return year + month + day; // YYYYMMDD 형식으로 반환
}
,
		formatDateToYYMMDD(date) {
			const year = date.getFullYear().toString().slice(-2);
			const month = (date.getMonth() + 1).toString().padStart(2, '0');
			const day = date.getDate().toString().padStart(2, '0');
			
			return year + month + day;
		},
		getTime: () => {
			var today = new Date();

			var hours = ("0" + today.getHours()).slice(-2);
			var minutes = ("0" + today.getMinutes()).slice(-2);
			var seconds = ("0" + today.getSeconds()).slice(-2);
			var timeString = hours + ":" + minutes + ":" + seconds;
			return timeString;
		},

		getToday: () => {
			var date = new Date();
			var year = date.getFullYear();
			var month = ("0" + (1 + date.getMonth())).slice(-2);
			var day = ("0" + date.getDate()).slice(-2);
			return year + month + day;
		},

		getYesterday: () => {
			let today = new Date();
			let yesterday = new Date(today.setDate(today.getDate() - 1));
			var year = yesterday.getFullYear();
			var month = ("0" + (1 + yesterday.getMonth())).slice(-2);
			var day = ("0" + yesterday.getDate()).slice(-2);
			return year + month + day;
		},

		getLastMonth: () => {
			var date = new Date();
			date.setMonth(date.getMonth() - 1);

			var year = date.getFullYear();
			var month = ("0" + (1 + date.getMonth())).slice(-2);
			var day = ("0" + date.getDate()).slice(-2);
			return year + month + day;
		},

		getTodayDateTime: () => {
			var date = new Date();
			var year = date.getFullYear();
			var month = ("0" + (1 + date.getMonth())).slice(-2);
			var day = ("0" + date.getDate()).slice(-2);
			return (
				year +
				month +
				day +
				("0" + date.getHours()).slice(-2) +
				("0" + date.getMinutes()).slice(-2) +
				("0" + date.getSeconds()).slice(-2)
			);
		},

		getSubDate: (subDay, subMonth, subYear) => {
			var today = new Date();
			today.setFullYear(today.getFullYear() - subYear);
			today.setMonth(today.getMonth() - subMonth);
			today.setDate(today.getDate() - subDay);

			var year = today.getFullYear();
			var month = today.getMonth() + 1;
			var day = today.getDate();

			month = month < 10 ? "0" + String(month) : month;
			day = day < 10 ? "0" + String(day) : day;

			return year + "-" + month + "-" + day;
		},

		addDateDash: (date) => {
			if(!date) return "-"
			var year = date.substring(0, 4);
			var month = date.substring(4, 6);
			var day = date.substring(6, 8);

			return year + "-" + month + "-" + day;
		},
		
		// 1200 --> 12:00 으로 변환
		addDateColon: (date) => {
			return date.slice(0,2) + ":" + date.slice(2,4);
		},
		getDayOfWeek: function (dateStr) { //ex) getDayOfWeek('2022-06-13')
			const week = ['일', '월', '화', '수', '목', '금', '토'];
			const dayOfWeek = week[new Date(dateStr).getDay()];
			return dayOfWeek;
		},

		/**
		* 현재 날짜에 해당 날짜만큼 더한 날짜를 반환한다.
		* @param {String} date			날짜 문자열(ex: 2018-01-01)
		* @param {Number} pnDayTerm		추가 일수
		* @return {String} 날짜 문자열
		*/
		addDate : function (psDate, pnDayTerm) {
			var pnYear = psDate.substring(0,4);
			var pnMonth = psDate.substring(5,7);
			var pnDay = psDate.substring(8,10);

			if (new Date(psDate)) {
			  var vdDate = new Date(pnYear, pnMonth-1, pnDay);
			  var vnOneDay = 1*24*60*60*1000 ; /* 1day,24hour,60minute,60seconds,1000ms */

			  var psTime = vdDate.getTime() + (Number(pnDayTerm)*Number(vnOneDay));
			  vdDate.setTime(psTime);

			  // return this.format(vdDate,"YYYY-MM-DD");
			  let addedDate = new Date(vdDate);

			  let year = addedDate.getFullYear();
			  let month = addedDate.getMonth() + 1;
			  let date = addedDate.getDate();

			  let monthStr = "";
			  let dateStr = "";

			  if(month.toString().length === 1) {
				monthStr = ''.concat("0", month.toString());
			  }else{
				monthStr = month;
			  }

			  if(date.toString().length === 1) {
				dateStr = ''.concat("0", date.toString());
			  }else{
				dateStr = date;
			  }

			  return year + "-" + monthStr + "-" + dateStr;
			}else{
			  return psDate;
			}
		},

		/**
		* 두 날짜간의 일(Day)수를 반환한다.
		* @param {String} psDate1st	년월 문자열(ex: 2018-02-01)
		* @param {String} psDate2nd    년월 문자열(ex: 2017-02-01)
		* @return {Number} 일수(Day)
		*/
		getDiffDay : function (psDate1st, psDate2nd) {
			var startDt = new Date(psDate1st);
			var endDt = new Date(psDate2nd);

			return parseInt((endDt - startDt)/(1000*60*60*24));
		},

		getDayIndex: function (addedDateDay) {
			let addedDateDayIndex = 0;
			switch(addedDateDay) {
				case "일": addedDateDayIndex = 0; break;
				case "월": addedDateDayIndex = 1; break;
				case "화": addedDateDayIndex = 2; break;
				case "수": addedDateDayIndex = 3; break;
				case "목": addedDateDayIndex = 4; break;
				case "금": addedDateDayIndex = 5; break;
				case "토": addedDateDayIndex = 6; break;
			}
			return addedDateDayIndex;
		},
	},

	formmater: {
		/** 콤마추가 */
		addComma: (str) => {
			if (str == null) {
				return "";
			}
			return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		},
		/** 콤마제거 */
		removeComma: (str) => {
			return str.replace(/,/g, "");
		},
		/** 폰번호 "01012345678" -> "010-2644-4093" */
		phone: (phone) => {
			return phone
				.replace(/[^0-9]/g, "")
				.replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/, "$1-$2-$3")
				.replace("--", "-");
		},
		/** 문자열에서 대쉬("-")제거  */
		removeDash: (str) => {
			if(!str) return "";
			const regx = /-/g;
			return str.replace(regx, "");
		},
		textLengthOverCut: (txt, len, lastTxt) => {
			if (len === "" || len === null) { // 기본값
				len = 20;
			}
			if (lastTxt === "" || lastTxt === null) { // 기본값
				lastTxt = "...";
			}
			if (txt.length > len) {
				txt = txt.substr(0, len) + lastTxt;
			}
			return txt;
		},
		hourFormatter: (hour) => {
			const regex = /^[0-9]+$/;
			if (!regex.test(hour)) {
				return "";
			}
			return hour;
		},
		minuteFormatter: (minute) => {
			const regex = /^[0-9]+$/;
			if (!regex.test(minute)) {
				return "";
			}
			return minute;
		}
	},
	logout: (sendLogoutAjax = true) => {
		if(sendLogoutAjax) {
			$.sendAjax({
				url: "/login/logout.api",
				data: {},
				contentType: "application/json",
				success : (res) => {
					console.log("🚀 ~ res:", res);
					location.href = "/sch/admin/login/login.html"
					util.clearStorage();
				}
			})
		}else{
			util.clearStorage();
			if(!location.href.includes("/sch/admin/login/login.html")){
				location.href = "/sch/admin/login/login.html"
			}
		}
	},

	setStorage: (key, val) => {
		const storage = window.localStorage.getItem("sch");
		const data = {
			...JSON.parse(storage),
			[key]: val,
		};
		window.localStorage.setItem("sch", JSON.stringify(data));
	},
	clearStorage: () => {
		window.localStorage.removeItem("sch");
	},
	getStorage: (key) => {
		const storage = window.localStorage.getItem("sch");
		return storage && JSON.parse(storage)[key];
	},
	getToken: () => {
		return util.getStorage("accessToken");
	},
	getUserSeq: () => {
		return util.getStorage("userSeq");
	},
	getUserEmail: () => {
		return util.getStorage("userEmail");
	},
	getUserAuthor: () => {
		return util.getStorage("userAuthor");
	},

	/** 파일에서 orientation 방향추출 */
	extractOrientation: async (file) => {
		const tags = await ExifReader.load(file);
		const orientation = tags.Orientation?.value;
		return orientation || 1;
	},
	/** 압축된 file을 promise로 리턴 */
	getCompressed: (file, option) => {
		return new Promise((res, rej) => {
			new Compressor(file, {
				// quality: 0.6,
				maxWidth: 400,
				maxHeight: 400,
				convertSize: 1000000,
				success(result) {
					res(result);
				},
				error(err) {
					rej(err);
				},
				...option,
			});
		});
	},

	/** binary 받아서 Base64 Encode 문자열로 반환 Ex.) data:image/jpeg; base64, GDYG….*/
	blobToBase64: (blob) => {
		return new Promise((resolve, _) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result);
			reader.readAsDataURL(blob);
		});
	},

	/** url 파라미터를 json으로 리턴 a.com?a=1&b=2 -> {a:1, b:2} */
	getUrlParamJson: (url = location.href) => {
		const result = {};
		url.replace(/[?&]{1}([^=&#]+)=([^&#]*)/g, function(s, k, v) {
			result[k] = decodeURIComponent(v);
		});
		return result;
	},

	/** 파라미터 명으로 value 얻기 ex a.com?a=1&b=2 -> getParameterByName("a") // 결과1 */

	getParameterByName: (name) => {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			results = regex.exec(location.search);
		return results == null ? "" : results[1];
	},
	// 미사용시 삭제요망
	//   canvasToBlob: (dataURI) => {
	//     var byteString = atob(dataURI.split(",")[1]);
	//     var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
	//     var ab = new ArrayBuffer(byteString.length);
	//     var ia = new Uint8Array(ab);
	//     for (var i = 0; i < byteString.length; i++) {
	//       ia[i] = byteString.charCodeAt(i);
	//     }

	//     var bb = new Blob([ab], { type: mimeString });
	//     return bb;
	//   },
	tableSetting: () => {
		var sortdir = "";
		/**
		 * th 클릭 시 정렬.
		 */
		$("#tableList th").each(function(column) {
			$(this).click(function() {
				if ($(this).is(".asc")) {
					$(this).removeClass("asc");
					$(this).addClass("desc");
					sortdir = -1;
				} else {
					$(this).addClass("asc");
					$(this).removeClass("desc");
					sortdir = 1;
				}

				$(this).siblings().removeClass("asc");
				$(this).siblings().removeClass("desc");

				var rec = $("#tableList").find("tbody > tr").get();
				rec.sort(function(a, b) {
					var val1 = $(a).children("td").eq(column).text().toUpperCase();
					var val2 = $(b).children("td").eq(column).text().toUpperCase();
					/*if(val1 === "" && val2 === ""){
								  val1 = document.querySelector(a).dataset.value
								  val2 = document.querySelector(b).dataset.value
							  }*/
					return val1 < val2 ? -sortdir : val1 > val2 ? sortdir : 0;
				});

				$.each(rec, function(index, row) {
					$("#tableList tbody").append(row);
				});
			});
		});

		$("#tableList tbody").on("click", "tr", function() {
			if ($(this).hasClass("selected")) {
				$(this).removeClass("selected");
			} else {
				$("tr.selected").removeClass("selected");
				$(this).addClass("selected");
			}
		});
	},

	sjChk: (str) => {
		/* 제목 100자 이내 */
		var obj = String(str);
		if (obj.length > 100 || obj.length === 0) {
			return true;
		}
		return false;
	},

	cnChk: (str) => {
		/* 내용 2000자 이내 */
		var obj = String(str);
		if (obj.length > 2000 || obj.length === 0) {
			return true;
		}
		return false;
	},

	cnTime: (time) => {
		getHour = time.substring(0, 2);
		getMin = time.substring(2, 4);
		var cnTime = getHour + " : " + getMin;
		return cnTime;
	},

	mToHi: (minute) => {
		var h = Math.floor(minute / 60);
		var i = minute % 60;
		if (h === 0 && i !== 0) {
			h = "00";
			if (i < 10 && i > 0) {
				i = "0" + i;
			}
		} else if (h !== 0 && i === 0) {
			i = "00";
			if (h < 10 && h > 0) {
				h = "0" + h;
			}
		} else if (h !== 0 && i !== 0) {
			if (i < 10 && i > 0) {
				i = "0" + i;
			}
			if (h < 10 && h > 0) {
				h = "0" + h;
			}
		} else {
			return "00 : 00";
		}

		return h + " : " + i;
	},

	addDateDot: (date) => {
		date = date.replace(/[^0-9]/g, "")
		var year = date.substring(0, 4);
		var month = date.substring(4, 6);
		var day = date.substring(6, 8);

		return year + "." + month + "." + day;
	},

	lastMonth: () => {
		var date = new Date();
		var year = date.getFullYear();
		var month = ("0" + (1 + date.getMonth())).slice(-2);
		
		return year + "-" + month;
	},
	changeCheckedStatus: (checkedStatus, inputTagName) => {
		let userKindInputList = document.getElementsByName(inputTagName);
		$.each(userKindInputList, function(idx, obj) {
			obj.checked = checkedStatus;
		});
	},
	changeCheckedStatusByClass: (checkedStatus, inputTagClass) => {
		let userKindInputList = document.getElementsByClassName(inputTagClass);
		$.each(userKindInputList, function(idx, obj) {
			obj.checked = checkedStatus;
		});
	},
	emptyCheck: (str) => {
		// 파라미터 확인후 "" 리턴.
		var obj = String(str);
		if (obj == null || obj == undefined || obj == "null" || obj == "undefined" || obj.length == 0)
			return "";
		else
			return str;
	}, 
	numToDay: (obj) => {
		// 요일변환 : 숫자를 한글로 반환
		let str = obj.replace("1","월")
				.replace("2","화")
				.replace("3","수")
				.replace("4","목")
				.replace("5","금")
				.replace("6","토")
				.replaceAll(",", "")
		return str
	},
	
	// 마지막 key값 다음 문자열 반환 함수
	getLastString: (fileCours) => {
		let obj = fileCours
		let str = ""
		if(obj.substring(0, 1) === "C"){
			str = obj.substring(obj.lastIndexOf("\\") + 1 );
		}else{
			str = obj.substring(obj.lastIndexOf("/") + 1 );
		}
		return str;
	},
	
	// 파일이름의 확장자 체크 후 type 반환 함수
	chkType: (str) => {
		const imgTypes = ['jpg', 'jpeg', 'png', 'gif'];
		const videoTypes = ['mp4'];
		let typeNm = str.substring(str.lastIndexOf('.') + 1 );
		let type = "" 
		if(imgTypes.includes(typeNm)){
			type="image"
		}else if(videoTypes.includes(typeNm)){
			type="video"
		}
		return type;
	},
	getDownloadUrl: (fileSeq) => {
		// const host = "https://schback2.musicen.com";
		const host = "";
		return host + `/cmmn/fileDownload.api?fileSeq=${fileSeq}`
	}
	 
};

//
function fileDownload(fileSeq, fileDetailSn) {
	const host = "";
	$.sendAjax({
		url: host + "/download/fileDownload.api",
		data: { fileSeq: fileSeq, fileDetailSn: fileDetailSn },
		contentType: "application/json",
		xhrFields: {
			responseType: "blob",
		},
		success: (res, status, xhr) => {
			console.log("🚀 ~ fileDownload ~ res:", res);
			var filename = "downloadFile";
			if (xhr.getResponseHeader("Content-Disposition")) {
				//filename
				filename = xhr.getResponseHeader("Content-Disposition").split("filename=")[1].split(";")[0];
				filename = decodeURIComponent(filename);
			}
			var link = document.createElement("a");

			link.href = URL.createObjectURL(res);
			link.download = filename;
			link.click();
		},
	});
}

// 모달창

function callPop(classId) {
	$(classId).show();
	$("body").addClass("ovf_hdn");
}

function closePop(classId) {
	$(classId).hide();
	$("body").removeClass("ovf_hdn");
}

function search_details() {
	$(document).on("click", ".search_details img", function() {
		$(".visibil").stop().slideToggle();
		$(".search_details").toggleClass("on");
	});
}

