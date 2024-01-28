var vueData = {
	
	// 이용자권한(G:guest,SA:관리자,PR:교수,ST:재학생,TJ:텐진,FF:교직원,ETA:중고생,ETB:초등학생,ETC:지역주민,AP:알파)
	userAuthor: "PR", // PR교수 SA관리자 AP알파
	userNm: "",
	userNcnm: "",
	userEmail: "",
	userPassword: "",
	userPasswordCheck: "",

	qestnCodeList: [], // 질문 목록
	qestnCode: "", // 질문 코드
	qestnRspns: "", // 질문 답변

	psitnNm: "", // 소속 /분자생물학과
	userInnb: "", // 사번 /14294
	lang: "K", //국적
	mbtlnum: "", // 휴대폰 번호 / 20221234

	proofImageCn: "", // 직원증 이미지
	proflImageCn: "", // 프로필 이미지
	profsrHist: "", //주요 이력
	proflColor: "#ffffff",

	allTerms: [],
	termBasic: {}, //기본 약관동의(필수) 
	termBasicFlag: false, //기본 약관동의(필수) 
	termMber: {}, //개인정보처리 동의(선택) 
	termMberFlag: false, //개인정보처리 동의(선택) 
	termMarkt: {}, //광고수신 동의(선택) 
	termMarktFlag: false, //광고수신 동의(선택) 
};

var vm;
var vueInit = () => {
	const app = Vue.createApp({
		data() {
			return vueData;
		},
		methods: {
			changeProof: async (e) => {
				const file = e.target.files[0];
				const compressedFile = await util.getCompressed(file);
				vm.proofImageCn = await util.blobToBase64(compressedFile);
			},
			changeProfl: async (e) => {
				const file = e.target.files[0];
				const compressedFile = await util.getCompressed(file);
				vm.proflImageCn = await util.blobToBase64(compressedFile);
			},
			addComma: util.addComma,
			termPopupOpen: (popupName) => {
				$("#" + popupName).modal();
			},

			adminRegist: events.adminRegist,

			dummy: function () {
				debugger;
				this.$data.userAuthor = "PR"; // PR교수 SA관리자 AP알파
				this.$data.userNm = "이름1";
				this.$data.userNcnm = "닉네임1";
				this.$data.userEmail = "go1@musicen.com";
				this.$data.userPassword = "whdgus159";
				this.$data.userPasswordCheck = "whdgus159";
				this.$data.qestnCodeList = []; // 질문 목록
				this.$data.qestnCode = "QUESTION_2"; // 질문 목록
				this.$data.qestnRspns = "김치답변1"; // 질문 목록
				this.$data.psitnNm = "분자생물학과"; // 소속
				this.$data.userInnb = "14294"; // 사번
				this.$data.lang = "K"; //국적
				this.$data.mbtlnum = "01012341234"; // 휴대폰 번호
				this.$data.proofImageCn =
					"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAHCAIAAAC6O5sJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAAuSURBVBhXY/iPA4AkVqxY0draCuHDAUgCKMrAgK4Vr1HIAG4sugTcWBxG/f8PALutmZ2F5MgiAAAAAElFTkSuQmCC"; // 직원증 이미지
				this.$data.proflImageCn =
					"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAHCAIAAAC6O5sJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAAuSURBVBhXY/iPA4AkVqxY0draCuHDAUgCKMrAgK4Vr1HIAG4sugTcWBxG/f8PALutmZ2F5MgiAAAAAElFTkSuQmCC"; // 프로필 이미지
				this.$data.profsrHist = "나는 이거이거잘함"; //주요 이력
				this.$data.proflColor = "#ffffff";
				this.$data.allTerms = [];
				this.$data.termBasic = {}; 
				this.$data.termBasicFlag = true; 
				this.$data.termMber = {}; 
				this.$data.termMberFlag = true; 
				this.$data.termMarkt = {}; 
				this.$data.termMarktFlag = false; 
			},
		},
		created() {
			console.log("app 2222");
			console.log("app mounted");

			// this.onClickLine(this.lines[0])
		},
		mounted: function () {
			// this.dummy();
		},
	});
	vm = app.mount("#content");
};

var events = {
	init: () => {},
	questionSelect: () => {
		$.ajax({
			type: "post",
			url: "/cmmn/selectCmmnCode.api",
			// url: "/login/questionList.api",
			headers: {},
			data: JSON.stringify({
				upperCmmnCode: "QUESTION"
			}),
			datatype: "json",
			contentType: "application/json",
			success: function (res) {
				console.log("🚀 ~ res:", res);
				vm.qestnCodeList = res.data;
				vm.qestnCode = vm.qestnCodeList[0].cmmnCode;
			},
			error: function (e) {
				console.log("🚀 ~ e:", e);
				$.alert(e.responseJSON.message);
			},
		});
	},
	popupDetailData: () => {
		$.ajax({
			type: "post",
			url: "/login/policyList.api",
			headers: {},
			data: JSON.stringify({}),
			datatype: "json",
			contentType: "application/json",
			success: function (res) {
				console.log("🚀 ~ res:", res);
				vm.allTerms = res.data;
				vm.termBasic = res.data.find((term) => term.cmmnCode === "POLICY_TERM");
				vm.termMber = res.data.find((term) => term.cmmnCode === "POLICY_MBER");
				vm.termMarkt = res.data.find((term) => term.cmmnCode === "POLICY_MARKT");
				console.log("🚀 ~ vm.termMarkt:", vm.termMarkt);
				console.log("🚀 ~ vm.termMber:", vm.termMber);
			},
			error: function (e) {
				$.alert(e.responseJSON.message);
			},
		});
	},

	submitCheck: () => {
		if (!vm.userNm) {
			$.alert("이름은 필수입니다");
			return;
		}
		if (!vm.userNcnm) {
			$.alert("닉네임은 필수입니다");
			return;
		}

		if (!util.validator.isEmail(vm.userEmail)) {
			$.alert("이메일 형식에 맞지 않습니다");
			return;
		}

		const safePw = util.validator.isSafePW(vm.userPassword);
		if (safePw !== true) {
			$.alert(safePw);
			return;
		}

		if (vm.userPassword !== vm.userPasswordCheck) {
			$.alert("비밀번호가 일치하지 않습니다");
			return;
		}

		if (!vm.qestnRspns) {
			$.alert("답변은 필수입니다");
			return;
		}

		if (!vm.psitnNm) {
			$.alert("소속은 필수입니다");
			return;
		}

		if (!vm.userInnb) {
			$.alert("사번은 필수입니다");
			return;
		}
		if (!util.validator.isTelNumber(vm.mbtlnum)) {
			$.alert("유효하지않은 휴대폰 번호입니다");
			return;
		}

		if (!vm.proofImageCn) {
			$.alert("직원증은 필수입니다");
			return;
		}
		if (!vm.proflImageCn) {
			$.alert("프로필은 필수입니다");
			return;
		}

		if (!vm.termBasicFlag) {
			$.alert("기본 약관동의는 필수입니다");
			return;
		}
		if (!vm.termMberFlag) {
			$.alert("개인정보처리방침 동의는 필수입니다");
			return;
		}

		return true;
	},

	adminRegist: async () => {
		if (!events.submitCheck()) return;
		const data = {
			userAuthor: vm.userAuthor,

			userNm: vm.userNm,
			userNcnm: vm.userNcnm,
			userEmail: vm.userEmail,
			userPassword: vm.userPassword,
			qestnCode: vm.qestnCode,
			qestnRspns: vm.qestnRspns,
			psitnNm: vm.psitnNm,
			userInnb: vm.userInnb,
			lang: vm.lang,

			mbtlnum: vm.mbtlnum.replace(/-/g,""),

			proofImageCn: vm.proofImageCn,
			proflImageCn: vm.proflImageCn,

			profsrHist: vm.profsrHist,

			proflColor: vm.proflColor,

			// 약관
			stplatCode: {
				POLICY_MBER: vm.termBasicFlag ? "Y" : "N",
				POLICY_TERM: vm.termMberFlag ? "Y" : "N",
				POLICY_MARKT: vm.termMarktFlag ? "Y" : "N",
			},
		};
		console.log("🚀 ~ adminRegist: ~ data:", data);

		$.sendAjax({
			url: "/login/adminRegist.api",
			data: data,
			contentType: "application/json",
			success: (res) => {
				console.log("🚀 ~ adminRegist: ~ res:", res);
				$.alert("회원가입이 완료되었습니다. 다시 로그인해주세요", () => {
					location.href = "/sch/admin/login/login.html"
				})
			},
			error: (err) => {
				console.log("🚀 ~ adminRegist: ~ err:", err);
				$.alert(err.responseJSON.message);
			},
		});
	},
};

$(function () {
	vueInit();
	events.questionSelect();
	events.popupDetailData();
	events.init();
});
