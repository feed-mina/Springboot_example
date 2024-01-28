var vueData = {
	noticeDetail : {},
	noticeUpdt : {},
	filesList : [],
	updtFiles : [],
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
			fnUpdt : event.fnUpdt,
			fnCancel : event.fnCancel,
			delFiles : event.delFiles,
			removeFiles : (idx) => {
				vm.updtFiles.splice(idx,1);
				vm.filesNo--;
				document.getElementById("fnAddFiles").form.reset();
			},
		}
	})
	vm = app.mount("#content");
};

let event = {
	init: () =>{
		event.noticeDetailOne();
		$('#fnAddFiles').on('change', function (obj) {
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
	
	noticeDetailOne: () => {
		const urlParams = new URL(location.href).searchParams;
		let param = { 
			bbsSeq : urlParams.get('bbsSeq')
		}
		$.sendAjax({
			url: "/board/selectNoticeDetail.api",
			data : param,
			contentType: "application/json",
			success : (res) => {
				vm.noticeUpdt = res.data;
				vm.noticeDetail.bbsSj = res.data.bbsSj;
				vm.noticeDetail.useAt = res.data.useAt;
				if(res.data.fileList){
					vm.filesList = res.data.fileList;
					vm.filesNo = vm.filesList.length;
				}
			}			
		})
	},
	
	fnUpdt: () => {
		//에디터값을 -> textarea에 저장 -> vue에 저장
    event.editorToTextarea();
		
		if(util.sjChk(vm.noticeUpdt.bbsSj)){
			$.alert("제목은 100자 이내로 작성해주세요.");
			return false;
		}
		
		if(vm.noticeUpdt.useAt === ''){
			$.alert("노출상태를 선택하세요.");
			return false;
		}
		
		let valiChk = event.removeHtml(vm.noticeUpdt.bbsCn);
		if(util.cnChk(valiChk)){
			$.alert("내용은 2000자 이내로 작성해주세요.");
			return false;
		}
		
		let files = '';
		if(vm.filesList.length){
			files = vm.filesList
		}else if(vm.updtFiles.length){
			files = vm.updtFiles
		}
		
		if(vm.noticeUpdt.bbsSe === 'B'){
			if(files.length > 0){
				for (let i = 0; i < files.length; i++) {
					if(vm.updtFiles.length > 0) {
						if (files[i].type.split('/')[0] !== "video") {
							$.alert("동영상 홍보판 노출을 선택하셨습니다. 첨부파일을 확인해주세요.");
		          return false;
			      }
			    }else if(vm.filesList.length > 0){
						if (vm.filesList[i].orignlFileNm.split('/')[1] !== "mp4") {
							$.alert("동영상 홍보판 노출을 선택하셨습니다. 첨부파일을 확인해주세요.");
		          return false;
			      }
					}
		    }
			}else{
				$.alert("홍보판 노출을 선택하셨습니다. 첨부파일을 확인해주세요.");
				return false;
			}
		}else if(vm.noticeUpdt.bbsSe === 'I'){
			if(files.length > 0){
				for (let i = 0; i < files.length; i++) {
					if(vm.updtFiles.length > 0) {
						if (files[i].type.split('/')[0] !== "image") {
							$.alert("이미지 홍보판 노출을 선택하셨습니다. 첨부파일을 확인해주세요.");
		          return false;
			      }
			    }else if(vm.filesList.length > 0){
						if (vm.filesList[i].orignlFileNm.split('/')[1] !== "png") {
							$.alert("이미지 홍보판 노출을 선택하셨습니다. 첨부파일을 확인해주세요.");
		          return false;
			      }
					}
				}
			}else{
				$.alert("홍보판 노출을 선택하셨습니다. 첨부파일을 확인해주세요.");
				return false;
			}
		}
		
		if(vm.noticeUpdt.bannerType === 'video'){
			vm.noticeUpdt.bannerNm = 'adVideo.mp4'
		}else if(vm.noticeUpdt.bannerType === 'image'){
			vm.noticeUpdt.bannerNm = 'adImage.png'
		}
		
		let formData = new FormData();
    
		if(vm.filesList.length > 0) {
			for (let i = 0; i < vm.filesList.length; i++) {
	      if (!vm.filesList[i].is_delete) {
	          formData.append('bbsFiles', vm.filesList[i]);
	      }
	    }
		}else if(vm.updtFiles.length > 0){
			for (let i = 0; i < vm.updtFiles.length; i++) {
	      if (!vm.updtFiles[i].is_delete) {
	          formData.append('bbsFiles', vm.updtFiles[i]);
	      }
	    }
		}else{
			if(vm.noticeUpdt.fileSeq){
				vm.noticeUpdt.delFileSeq = vm.noticeUpdt.fileSeq;
				vm.noticeUpdt.fileSeq = "";
			}
		}
		
    formData.append('paramMap', new Blob([JSON.stringify(vm.noticeUpdt)], {type: 'application/json'}));
		
    for (var pair of formData.entries()) { }
    if(vm.noticeUpdt.useAt === 'Y' && (vm.noticeUpdt.bbsSe === 'B' || vm.noticeUpdt.bbsSe === 'I')){
			$.sendAjax({
				url: "/board/upsertBanner.api",
				data : formData,
				enctype: "multipart/form-data",
	      contentType:false,
	      processData: false,
	      cache: false,
				success : (res) => {
					
				}			
			})
		}
		
		$.sendAjax({
			url: "/board/upsertBbs.api",
			data : formData,
			enctype: "multipart/form-data",
      contentType:false,
      processData: false,
      cache: false,
			success : (res) => {
				$.alert("수정 완료되었습니다. 공지사항 목록으로 이동합니다.", () => {
					location.href="noticeList.html";
				});				
			}			
		})
	},
	
	fnCancel: () => {
		$.confirm("지금까지 입력한 내용이 모두 사라집니다. 정말 취소하시겠습니까?", () => {
			oEditors.getById["bbsCn"].exec("SET_IR", [vm.noticeUpdt.bbsCn]); //내용초기화
			vm.noticeUpdt.bbsSj = vm.noticeDetail.bbsSj;
			vm.noticeUpdt.useAt = vm.noticeDetail.useAt;
			
			$.confirm("입력한 내용이 취소되어 목록으로 이동합니다.", () => {
				location.href="noticeList.html"
			})
		})
	},
	
	addFiles: function (obj) {
        const _this = this;
        let maxCnt = 1; // 첨부파일 최대 갯수
        let attachFileCnt = vm.filesNo; // 기존 추가된 첨부파일 갯수
        let ableFileCnt = maxCnt - attachFileCnt; // 추가 가능한 첨부파일 갯수
        let currentFileCnt = obj.target.files.length; // 현재 선택된 첨부파일 갯수

        //첨부파일 갯수 확인
        if (currentFileCnt > ableFileCnt) {
            $.alert('첨부파일은 1개만 가능합니다.');
        } else {
            $.each(obj.target.files, function (i, val) {
                // 첨부파일 검증
                if (_this.fileValidation(val)) {
                    // 파일 배열에 담기
                    let reader = new FileReader();
                    reader.onload = function () {
                        vm.updtFiles.push(val);
                    };
                    reader.readAsDataURL(val);
                    vm.filesNo++;
                }
            });
        }
    },
    fileValidation: function (obj) {
        const fileTypes = ['video/mp4', 'image/png'];
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
						vm.noticeUpdt.bannerType = obj.type.split('/')[0]
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
    }
    
}

$(document).ready( () => {
	vueInit();
	event.init();
}) 