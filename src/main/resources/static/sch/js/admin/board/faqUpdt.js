var vueData = {
	faqDetail :{},
	faqUpdt : {},
	cmmnCode : [],
	filesList : [],
	bbsFiles : [],
	filesNo : 0
}

var oEditors = [];
var vm;

var vueInit = () => {
	const app = Vue.createApp({
		data() {
			return vueData;
		},
		methods: {
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
						vm.faqUpdt = res.data;
						vm.faqDetail.bbsSe = res.data.bbsSe;
						vm.faqDetail.bbsCn = res.data.bbsCn;
						vm.faqDetail.bbsSj = res.data.bbsSj;
						vm.faqDetail.useAt = res.data.useAt;
						if(res.data.fileList){
							vm.filesList = res.data.fileList;
							for(var i=0; i < vm.filesList.length; i++){
								var cours = vm.filesList[i].fileCours
								vm.filesList[i].fileNm = util.getLastString(cours)
								var fileNm = vm.filesList[i].orignlFileNm
								vm.filesList[i].fileType = util.chkType(fileNm)
							}
							vm.filesNo = vm.filesList.length;
						}
					}			
				})
			},
			fnBbsSe : (bbsSe) => {
				vm.faqUpdt.fnBbsSe = bbsSe;
			},
			fnSave : () => {
				//에디터값을 -> textarea에 저장 -> vue에 저장
    		event.editorToTextarea();
    		
				if(vm.faqUpdt.bbsSe === ''){
					$.alert ("카테고리를 선택하세요.");
					return false;
				}
				if(util.sjChk(vm.faqUpdt.bbsSj)){
					$.alert("제목은 100자 이내로 작성해주세요.");
					return false;
				}
				if(vm.faqUpdt.useAt === ''){
					$.alert("노출상태를 선택하세요.");
					return false;
				}
				let valiChk = event.removeHtml(vm.faqUpdt.bbsCn);
				if(util.cnChk(valiChk)){
					$.alert("내용은 2000자 이내로 작성해주세요.");
					return false;
				}
				
				/*let files = '';
				if(vm.filesList.length){
					files = vm.filesList
				}else if(vm.updtFiles.length){
					files = vm.updtFiles
				}*/
				
				let formData = new FormData();
				
				if(vm.filesList.length > 0) {
					for (let i = 0; i < vm.filesList.length; i++) {
			      /*if (!vm.filesList[i].is_delete) {
			          formData.append('bbsFiles', vm.filesList[i]);
			      }*/
			      let j = $('div[name=fileSn]')[i].dataset.value
						vm.bbsFiles[i] = vm.filesList[j]
						formData.append('bbsFiles', vm.bbsFiles[i]);
			    }
			    vm.faqUpdt.filesList = vm.bbsFiles
				}else{
					if(vm.faqUpdt.fileSeq){
						vm.faqUpdt.delFileSeq = vm.faqUpdt.fileSeq;
					}
				}
				
    		formData.append('paramMap', new Blob([JSON.stringify(vm.faqUpdt)], {type: 'application/json'}));
    		
				$.sendAjax({
					url: "/board/upsertBbs.api",
					data : formData,
					enctype: "multipart/form-data",
		      contentType:false,
		      processData: false,
		      cache: false,
					success : () => {
						$.alert ("수정 완료되었습니다. FAQ 목록으로 이동합니다.", () => {
							location.href="faqList.html";
						});
					}			
				})
			},
			fnCancel : () => {
				$.confirm("지금까지 입력한 내용이 모두 사라집니다. 정말 취소하시겠습니까?", () => {
					vm.faqUpdt.bbsSe = vm.faqDetail.bbsSe;
					vm.faqUpdt.bbsSj = vm.faqDetail.bbsSj;
					vm.faqUpdt.useAt = vm.faqDetail.useAt;
					vm.faqUpdt.bbsCn = vm.faqDetail.bbsCn;
					$.confirm("입력한 내용이 취소되어 목록으로 이동합니다.", () => {
						location.href="faqList.html"
					})
				})
			},
			delFiles : event.delFiles,
			removeFiles : (idx) => {
				vm.filesList.splice(idx,1);
				vm.filesNo--;
				document.getElementById("fnAddFiles").form.reset();
			},
		}
	})
	vm = app.mount('#content');
}

let event = {
	init: () =>{
		$('#fnAddFiles')	.on('change', function (obj) {
			event.addFiles(obj);
		})
		
		nhn.husky.EZCreator.createInIFrame({
	      oAppRef: oEditors,
	      elPlaceHolder: "bbsCn",		//textarea에서 지정한 id와 일치해야 합니다.
	      //SmartEditor2Skin.html 파일이 존재하는 경로
	      sSkinURI: "/js/SE2/SmartEditor2Skin.html",	// Editor HTML파일 위치로 변경
	      fCreator: "createSEditor2",
	      htParams: {
	          // 툴바 사용 여부 (true:사용/ false:사용하지 않음)
	          bUseToolbar: true,
	          // 입력창 크기 조절바 사용 여부 (true:사용/ false:사용하지 않음)
	          bUseVerticalResizer: true,
	          // 모드 탭(Editor | HTML | TEXT) 사용 여부 (true:사용/ false:사용하지 않음)
	          bUseModeChanger: true,
	      }
	  })
	  
	  const columns = document.querySelectorAll(".fileList");
		columns.forEach((item) => {
		  new Sortable(item, {
		    group: "shared",
		    animation: 150,
		    ghostClass: "blue-background-class"
		  });
		});

	},
	
	editorToTextarea: () => {
		oEditors.length && oEditors.getById["bbsCn"].exec("UPDATE_CONTENTS_FIELD", []);
    $("#bbsCn")[0].dispatchEvent(new Event("input"));
	},
	
	textToEditor: () => {
    oEditors.length && oEditors.getById["bbsCn"].exec("LOAD_CONTENTS_FIELD");
  },
	
  removeHtml: function (text) {
      text = text.replace(/<br>/ig, '');
      text = text.replace(/&nbsp;/ig, ''); // 공백제거
      text = text.replace(/<(\/)?([a-zA-Z]*)(\s[a-zA-Z]*=[^>]*)?(\s)*(\/)?>/ig, ''); // html태그 삭제
      return text;
  },
  
  addFiles: function (obj) {
        const _this = this;
        let maxCnt = 12; // 첨부파일 최대 갯수
        let attachFileCnt = vm.filesNo; // 기존 추가된 첨부파일 갯수
        let ableFileCnt = maxCnt - attachFileCnt; // 추가 가능한 첨부파일 갯수
        let currentFileCnt = obj.target.files.length; // 현재 선택된 첨부파일 갯수

        //첨부파일 갯수 확인
        if (currentFileCnt > ableFileCnt) {
            $.alert('첨부파일은 최대 12개까지만 가능합니다.');
        } else {
            $.each(obj.target.files, function (i, val) {
                // 첨부파일 검증
                if (_this.fileValidation(val)) {
                    // 파일 배열에 담기
                    let reader = new FileReader();
                    reader.onload = function (e) {
												val.src = e.target.result
												val.fileType = val.type.split('/')[0]
                        vm.filesList.push(val);
                    };
                    reader.readAsDataURL(val);
                    vm.filesNo++;
                }
            });
        }
    },
    fileValidation: function (obj) {
        const fileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'video/mp4'];
        if (obj.name.length > 100) {
            $.alert("파일명이 100자 이상인 파일은 제외되었습니다.");
            return false;
        } else if (obj.size > (200 * 1024 * 1024)) {
            $.alert("최대 파일 용량인 200MB를 초과한 파일은 제외되었습니다.");
            return false;
        } else if (obj.name.lastIndexOf('.') == -1) {
            $.alert("확장자가 없는 파일은 제외되었습니다.");
            return false;
        } else if (!fileTypes.includes(obj.type)) {
						$.alert("등록할 수 없는 파일타입 입니다.");
            return false;
        } else {
            return true;
        }
    },
    delFiles: function (fileSeq, fileSn, idx) {
        let param = {
            fileDetailSn: fileSn,
            fileSeq: fileSeq
        }
        $.confirm("삭제 하시겠습니까?", () => {
            $.sendAjax({
                url: "/board/deleteOneFile.api",
                data: param,
                contentType: "application/json",
                success: function (res) {
									vm.filesList.splice(idx,1);
									vm.filesNo--;
									document.getElementById("fnAddFiles").form.reset();
									$.alert ("삭제되었습니다.");
                },
            });
        });
    },
}

$(document).ready( () => {
	vueInit();
	event.init();
	vm.getCmmnCodeList();
	vm.faqDetailOne();
})
