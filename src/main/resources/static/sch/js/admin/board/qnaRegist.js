var vueData = {
	qnaDetail :{},
	answerData : {},
	cmmnCode : [],
	exBbsSe : '',
	scrUseAt : false,
	alarmFormList: []
}

var vm;

var vueInit = () => {
	const app = Vue.createApp({
		data() {
			return vueData;			
		},
		methods: {
			fnBbsSe : (bbsSe) => {
				vm.qnaDetail.bbsSe = bbsSe;
			},
			fnSave : () => {
				if(vm.qnaDetail.bbsSe === ''){
					$.alert ("카테고리를 선택하세요.");
					return false;
				}
				if(util.emptyCheck(vm.qnaDetail.ansCn) === ''){
					$.alert ("답변내용을 입력하세요.");
					return false;
				}
				if(vm.exBbsSe !== vm.qnaDetail.bbsSe){
					vm.answerData.cnBbsSe = vm.qnaDetail.bbsSe
				}
				if(vm.scrUseAt === true){
					if(vm.qnaDetail.useAt === 'Y'){
						vm.answerData.useAt = 'H'	// 일반글 숨김
					}else if(vm.qnaDetail.useAt === 'S'){
						vm.answerData.useAt = 'B'	// 비밀글 숨김
					}
				}else{
					vm.answerData.useAt = vm.qnaDetail.useAt
				}
				
				vm.answerData.bbsCode = 'QNA'
				vm.answerData.bbsSe = vm.qnaDetail.bbsSe
				vm.answerData.bbsSj = '답변입니다.'
				vm.answerData.registSj = vm.qnaDetail.bbsSj

				//enter => <br>
				var text = vm.qnaDetail.ansCn;
				text = text.replace(/(?:\r\n|\r|\n)/g, '<br>');
				vm.answerData.bbsCn =  text
				vm.answerData.q_bbsSeq = vm.qnaDetail.bbsSeq
				vm.answerData.upperBbsSeq = vm.qnaDetail.bbsSeq
				vm.answerData.cnt = vm.qnaDetail.cnt
				vm.answerData.registId = vm.qnaDetail.registId
				vm.answerData.alarmFormList = vm.alarmFormList
				
				let formData = new FormData();
    		formData.append('paramMap', new Blob([JSON.stringify(vm.answerData)], {type: 'application/json'}));
    		
				$.sendAjax({
					url: "/board/upsertBbs.api",
					data : formData,
					enctype: "multipart/form-data",
		      contentType:false,
		      processData: false,
		      cache: false,
					success : () => {
						$.alert ("답변 등록이 완료되었습니다. Q&A 목록으로 이동합니다.", () => {
							location.href="qnaList.html";
						});
					}			
				})
			},
			fnCancel : () => {
				$.confirm("지금까지 입력한 내용이 모두 사라집니다. 정말 취소하시겠습니까?", () => {
					vm.qnaDetail.ansCn = ''
					vm.scrUseAt = false
					vm.qnaDetail.bbsSe = vm.exBbsSe
					$.confirm("입력한 내용이 취소되어 목록으로 이동합니다.", () => {
						location.href="qnaList.html"
					})
				})
			}
			
		}
	})
	vm = app.mount('#content');
}

var event = {
	getCmmnCodeList : () => {
		let param = {
			upperCmmnCode : 'BBS'
		}
		$.sendAjax({
			url: "/cmmn/selectCmmnCode.api",
			data: param,
			contentType: "application/json",
			success : (res) => {
				vm.cmmnCode = res.data;
			}			
		})
	},
	
	qnaDetailOne: () => {
		const urlParams = new URL(location.href).searchParams;
		let param = {
			bbsSeq : urlParams.get('bbsSeq')
		}
		
		$.sendAjax({
			url: "/board/selectQnaDetail.api",
			data : param,
			contentType: "application/json",
			success : (res) => {
				vm.qnaDetail = res.data;
				vm.exBbsSe = res.data.bbsSe;
				var obj = res.data.useAt
				if(obj === "H" || obj === "B"){
					vm.scrUseAt = true;
				}else{
					vm.scrUseAt = false;
				}
			}			
		})
	}
}


$(document).ready( () => {
	vueInit();
	event.getCmmnCodeList();
	event.qnaDetailOne();	
})

