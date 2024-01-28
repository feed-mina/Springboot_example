var vueData = {
  mberDetail: {},
  urlParams: "",
  questionList:[],
}

var vm;

var vueInit = () => {
  const app = Vue.createApp({
    data() {
      return vueData;
    },
    methods: {
      fnSaveMber: () => {
        let param = {
          ...vm.mberDetail,
		  stplatCode : {
			POLICY_TERM : vm.mberDetail.tusAdvrts,
			POLICY_MARKT : vm.mberDetail.tusMarkt,
		  }
        };
	
        $.confirm("저장 하시겠습니까?", () => {
          $.sendAjax({
            // url: "/sysManage/updateMber.api",
            url: "/login/userUpdate.api",
            data: param,
            contentType: "application/json",
            success: (res) => {
              $.confirm("정상적으로 처리 되었습니다.", () => {
                window.location.href = "/sch/admin/sysManage/mberDetail.html?userSeq=" + param.userSeq;
              })
            }
          })
        })
      },
      mberDetailOne: () => {
        let param = {
          userSeq: this.urlParams.get('userSeq'),
          flag: this.urlParams.get('flag'),
        }

        $.sendAjax({
          url: "/sysManage/selectMberOneDetail.api",
          data: param,
          contentType: "application/json",
          success: (res) => {
            vm.mberDetail = res.data;
            let title = param.flag === "admin" ? "관리자 계정 관리 수정" : "일반회원 관리 수정";
            $("#pageTitle").text(title);
            vm.mberDetail.mbtlnum = res.data.mbtlnum ? util.formmater.phone(res.data.mbtlnum) : null;
          }
        })
      },
      selectCmmnCode: () => {

        let param = {
          upperCmmnCode: "QUESTION"
        }

        $.sendAjax({
          url: "/cmmn/selectCmmnCode.api",
          data: param,
          contentType: "application/json",
          success: (res) => {
            vm.questionList = res.data;
          }
        })
      },
      changeImage: async (e, flag) => {
        const compressedFile = await util.getCompressed(e.target.files[0]);
        util.blobToBase64(compressedFile).then(function (compressedFile) {
          if (flag === 'M') {
            $('#mImg').attr('src', compressedFile);
            vm.mberDetail.proofImageCn = compressedFile;
          } else if (flag === 'P') {
            $('#pImg').attr('src', compressedFile);
            vm.mberDetail.proflImageCn = compressedFile;
          }
        });
      },
      updateProflColor: (event) => {
        vm.mberDetail.proflColor = event.target.value;
      }
    }
  })
  vm = app.mount('#content');
}

var event = {}

$(document).ready(() => {
  this.urlParams = new URL(location.href).searchParams;
  vueInit();
  vm.mberDetailOne();
  vm.selectCmmnCode();
})
