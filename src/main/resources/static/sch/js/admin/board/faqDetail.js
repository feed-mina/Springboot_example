var vueData = {
	faqDetail :{},
	filesList : []
}

var vm;

var vueInit = () => {
	const app = Vue.createApp({
		data() {
			return vueData;
		},
		methods: {
			fnUpdtMov : () => {
				location.href="faqUpdt.html?bbsSeq=" + vm.faqDetail.bbsSeq
			},
			fnDel : () => {
				$.confirm("정말 삭제하시겠습니까? 삭제한 자료는 다시 복구하지 못합니다.", () => {
						let param = {
							bbsCode : "FAQ",
							bbsSeq : vm.faqDetail.bbsSeq
						}
						
						if(util.emptyCheck(vm.noticeDetail.fileSeq) !== '' ){
							param.fileSeq = vm.noticeDetail.fileSeq;
							param.delFileSeq = vm.noticeDetail.fileSeq;
						}
						
						$.sendAjax({
						url: "/board/deleteBbsOne.api",
						data : param,
						contentType: "application/json",
						success : () => {
							$.alert("삭제가 완료되었습니다.", () => {
								location.href="faqList.html"
							});				
						}			
					})
				})
			},
			faqDetailOne: () => {
				const urlParams = new URL(location.href).searchParams;
				let param = {
					bbsSeq : urlParams.get('bbsSeq')
				}
				
				$.sendAjax({
					url: "/board/selectFaqDetail.api",
					data : param,
					contentType: "application/json",
					success : (res) => {
						vm.faqDetail = res.data;
						$('#bbsCn').append(res.data.bbsCn);
						if(res.data.fileList){
							vm.filesList = res.data.fileList;
							for(var i=0; i < vm.filesList.length; i++){
								var cours = vm.filesList[i].fileCours
								vm.filesList[i].fileNm = util.getLastString(cours)
								var fileNm = vm.filesList[i].orignlFileNm
								vm.filesList[i].fileType = util.chkType(fileNm)
							}
						}
					}			
				})
			},
			downloadFile : (fileSeq, fileDetailSn) =>{
				fileDownload(fileSeq, fileDetailSn);
			}
		}
	})
	vm = app.mount('#content');
}

var event = {
	
	
}


$(document).ready( () => {
	vueInit();
	vm.faqDetailOne();
})

