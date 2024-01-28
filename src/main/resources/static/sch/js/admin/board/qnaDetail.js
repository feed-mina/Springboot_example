var vueData = {
	qnaDetail :{},
	cmmnCode : []
}

var vm;

var vueInit = () => {
	const app = Vue.createApp({
		data() {
			return vueData;			
		},
		methods: {
			fnUpdtMov : () => {
				location.href="qnaUpdt.html?bbsSeq=" + vm.qnaDetail.bbsSeq
			},
			fnDel : () => {
				$.confirm("정말 삭제하시겠습니까? 삭제한 자료는 다시 복구하지 못합니다.", () => {
						let param = {
							bbsSeq : vm.qnaDetail.ansSeq,
							bbsCode : "QNA"
						}
						
						$.sendAjax({
						url: "/board/deleteBbsOne.api",
						data : param,
						contentType: "application/json",
						success : () => {
							$.alert("삭제가 완료되었습니다.", () => {
								location.href="qnaList.html"
							});				
						}			
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
            if (res.data && res.data.ansCn) {
                res.data.ansCn = res.data.ansCn.replace(/<br>/g, '\n');
            }
           vm.qnaDetail = res.data;
			}			
		})
	}
}


$(document).ready( () => {
	vueInit();
	event.getCmmnCodeList();
	event.qnaDetailOne();	
})

