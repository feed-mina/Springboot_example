var vueData = {
    preview: "", 
    gongjarueList: {
        modalGongjarueSeq: [],
        modalImageFileSeq: [],
        gongjarueSeq: [],
        modalNum: [],
        fileSeq: [],
        gongjarueDetailSubjectArray: [],
        gongjarueDetailOutlineArray: [],
        detailGongjarueCo: '',
        gongjarueNum: [],
        imgUrl: [],
        imageFileSeq: [],
        spotArr1: [],
        NumArr1: [],
        imgUrlArr1: [],
        gongjarueSeqArray1: [],
        imageFileSeqArray1: [],
        spotArr2: [],
        NumArr2: [],
        imgUrlArr2: [],
        gongjarueSeqArray2: [],
        imageFileSeqArray2: [],
        spotArr3: [],
        NumArr3: [],
        imgUrlArr3: [],
        gongjarueSeqArray3: [],
        imageFileSeqArray3: [],
        gongjarueSeqArray4: [],
        imageFileSeqArray4: [],
        spotArr4: [],
        NumArr4: [],
        imgUrlArr4: [],
        gongjarueDetailSubjectArray: [],
        gongjarueDetailOutlineArray: [],
        detailGongjarueCo: '',
        gongjarueNum: []
    },
    UpdtGongjarueModal: {
        gongjarueSj: '',
        gongjarueCn: '',
        gongjarueSeq: ''
    },
    UpdtGongjarueModalList2: [],
    UpdtGongjarueModalList: {
        gongjarueSeq: [],
        gongjarueCn: [],
        gongjarueSj: [],
        imgList: [],
        file: []
    },
    gongjarueUpdtList: {
        gongjarueSeq: [],
        file: [],
    },
    gongjarueData: [],
    searchData: {
        searchText: ''
    },
    changeData: {
        inputNum: '',
        inputNum2: '',
        imgNum: '',
        clickImg: '', // vm.changeData.clickImg , vm.changeData.clickImg, vm.changeData.imgNum
    },
    sliceData1: [],
    sliceData2: [],
    sliceData3: [],
    sliceData4: [],  
    UpdtGongjarueImg: {}, 
    gongjarueUpdtSaveList: []
};

let dataPerPage = 10;
let pagePerBar = 10;
let pageCount = 10;

var clickImg = 0;
var vm;
var vueInit = () => {
    var items = []
    const app = Vue.createApp({
        data() {
            return items, vueData;
        }, 
        methods: {
            fnCancel: function () {
                // 전체 취소버튼 클릭할때 작동
                $.confirm("지금까지 수정한 내용이 모두 사라집니다.정말 취소하시겠습니까?", () => {
                    $.alert("입력한 내용이 취소되었습니다.", () => {
                        //내용초기화하는 부분 작성하기
                    });
                })
            },
            fnModalSave: function (e) {

                console.log('설명등록버튼클릭')
                //   vm.changeData.inputNum = targetId.split('_')[1].slice(6)
                vm.changeData.inputNum = e.target.id.slice(3)
                console.log(vm.changeData)
                if (parseInt(vm.changeData.inputNum) < 10) {
                    vm.changeData.inputNum2 = 'GONGJARUE_0000000' + vm.changeData.inputNum
                } else if (parseInt(vm.changeData.inputNum) >= 10) {
                    vm.changeData.inputNum2 = 'GONGJARUE_000000' + vm.changeData.inputNum
                }
                console.log(e.target)
                console.log(e.target.id)
                console.log(vm.changeData.inputNum2)
                $('#gongjarueDataModal').modal('show');
                console.log('fnModalSave 함수 진입')
                vm.gongjarueList.modalGongjarueSeq.push(vm.changeData.inputNum2);
                vm.gongjarueList.modalNum.push(vm.changeData.inputNum);
            },
            fnModalCancel: function () {
                event.clearModal();
            },
            fnSave: () => {
                /**unity에 적용할수있는 적용버튼에 작동된다. */
            },
        }
    })
    vm = app.mount("#content");

};
let event = {
  init: () => {

    $(document).on("click", "#closeModal", function (e) {
      event.clearModal();
    });
    $(document).on("click", "#addGongjarueSnModalBtn2", function (e) {
      console.log('설명등록버튼클릭')
      //   vm.changeData.inputNum = targetId.split('_')[1].slice(6)
      vm.changeData.inputNum = e.target.id.slice(3)
      console.log(vm.changeData)
      if (parseInt(vm.changeData.inputNum) < 10) {
        vm.changeData.inputNum2 = 'GONGJARUE_0000000' + vm.changeData.inputNum
      } else if (parseInt(vm.changeData.inputNum) >= 10) {
        vm.changeData.inputNum2 = 'GONGJARUE_000000' + vm.changeData.inputNum
      }
      $('#gongjarueDataModal').modal('show');
    });

    $(document).on("click", "#btnModalSave", function (e) {
      console.log('모달정보저장버튼클릭')
      if (clickImg !== undefined) {
        clickImg++
      }
      console.log(clickImg)
      vm.changeData.clickImg = clickImg
      event.dataBindingForSend(e);
    });

    $(document).on("click", "#modalYes", function (e) {
      console.log('모달확인버튼 클릭')
      $('#gongjarueDataModal').modal('hide');
    });

    $(document).on("click", "#closeModalBtn", function (e) {
      console.log('모달취소버튼클릭')
      $('#gongjarueDataModal').modal('hide');
      event.clearModal();
    });
    $(document).on("click", "#addGongjaruePicModalBtn", function (e) {
      if (clickImg !== undefined) {
        // clickImg 가 undefined값이 나오면 추가 x
        clickImg++
      }
      console.log(clickImg)
      vm.changeData.clickImg = clickImg
      console.log('사진등록버튼클릭됨')
      console.log(e.target)
      console.log(e.target.id)
      vm.changeData.inputNum = e.target.id.slice(4)
      if (parseInt(vm.changeData.inputNum) < 10) {
        vm.changeData.inputNum2 = 'GONGJARUE_0000000' + vm.changeData.inputNum;
      } 
      else if (parseInt(vm.changeData.inputNum) >= 10) {
        vm.changeData.inputNum2 = 'GONGJARUE_000000' + vm.changeData.inputNum;
      };
      vm.changeData.inputNum2 = e.target.id;
      $("#inputImgFileId").click();
    });

    $(document).on("change", "#inputImgFileId", function (e) {
      console.log('다른사진으로 변경')
      event.changeImage(e);
      event.PicSave(e);
    });

    // 반영 버튼 누르면 함수적용 > updateSave이벤트에 picSaveList이벤트와 modalSave이벤트를 합칠 예정
    $(document).on("click", "#updateBtn", function (e) {
      event.PicSave(e);
      //   event.PicSaveList(e);
      event.modalSave(e);
      // event.updateSave(e)
    });

  },
  changeImage: async (e) => {
    // 사진 미리보기 기능
    console.log('changeImage함수탐')
    //console.log(e)
    console.log(e.target)
    const base64 = await util.blobToBase64(e.target.files[0]);
    vm.preview = base64;

    var a = Array.from(document.getElementsByClassName('sliceDataPic'));

    // 사진 등록 버튼을 누르면 사진이 하나씩 변경됨			
    // 현재 순서의 이미지에 base64 값을 src로 설정

    console.log(a)
    // 사진을 미리보기하는 기능 
    Array.from(document.getElementsByClassName('sliceDataPic'))[vm.changeData.inputNum - 1].src = vm.preview

    console.log($("#inputImgFileId")[0])
    const file = $("#inputImgFileId")[0].files[0]
    console.log(file)
    if (parseInt(vm.changeData.inputNum) < 10) {
      vm.changeData.inputNum2 = 'GONGJARUE_0000000' + vm.changeData.inputNum;
    } else if (parseInt(vm.changeData.inputNum) >= 10) {
      vm.changeData.inputNum2 = 'GONGJARUE_000000' + vm.changeData.inputNum;
    }
    console.log(e.target)
    console.log(e.target.id)
    console.log(vm.changeData.inputNum2)
    vm.gongjarueUpdtList.gongjarueSeq.push(vm.changeData.inputNum2);
    vm.gongjarueUpdtList.file.push(file);
    //event.PicSaveList(e)
    // event.PicSave(e)

  },
  PicSave: async (e) => {
    console.log('사진저장시작')
    console.log(e)
    const formData = new FormData();
    console.log($("#inputImgFileId")[0])
    const file = $("#inputImgFileId")[0].files[0];
    console.log(file) // updateImg.api 에 필요한 파람값 1 
    if (parseInt(vm.changeData.inputNum) < 10) {
      vm.changeData.inputNum2 = 'GONGJARUE_0000000' + vm.changeData.inputNum
    }
     else if (parseInt(vm.changeData.inputNum) >= 10) {
      vm.changeData.inputNum2 = 'GONGJARUE_000000' + vm.changeData.inputNum
    };
    console.log(e.target)
    console.log(e.target.id)
    console.log(vm.changeData.inputNum2)


    // 여기 아래는 한건씩 처리하는 방법 (vm.UpdtGongjarueImg) 
    vm.UpdtGongjarueImg.gongjarueSeq = vm.changeData.inputNum2;
    console.log(vm.gongjarueUpdtList)
    console.log(vm.UpdtGongjarueImg) // updateImg.api에 필요한 파람값2 
    //적용버튼은 seq에 따라서 list를 한번에 1:n 으로 / 여러개를 저장한다. 
    // 상담등록할때 시간을 여러개 추가해서 fx테이블 저장할때 , 요일이랑 시간을 같이 받았고 그에 따라 순서대로 sn을 부여해서 다시 저장했다. 
    // spotKey를 sn으로 간주, 요일이랑 시간을 for문으로여러번돌렸던건 음 여기서 seq에따라서 버튼을 클릭한 숫자나, changeUpdate 함수를 타는 target을 새는 방법 이 있을꺼같다.
    // 함수를 타는 파라미터 변수 또는 함수를 몇번 타는지 알 수있는 방법이 있을까?
    const payload = {
      updtList: vm.gongjarueUpdtList
    };
    formData.append("uploadFile", file);
    const paramMap = vm.UpdtGongjarueImg // parmaMap 에서 seq와 img를 받자. image_file_seq=#{fileSeq}
    console.log(paramMap)
    console.log(vm.changeData.clickImg)
    var clickNum = vm.changeData.clickImg;
    formData.append("paramMap", JSON.stringify(paramMap));

    $.sendAjax({
      url: "/experience/updateGongjarueImg.api",
      data: formData,
      enctype: "multipart/form-data",
      contentType: false,
      processData: false,
      cache: false,
      success: (res) => {
        console.log(res);
      }

    })
  },
  PicSaveList: async (e) => {
    console.log('적용버튼 사진 저장시작')
    console.log(e)
    const formData = new FormData();

    // updateImg.api에 필요한 파람값2 
    //적용버튼은 seq에 따라서 list를 한번에 1:n 으로 / 여러개를 저장한다. 
    // 상담등록할때 시간을 여러개 추가해서 fx테이블 저장할때 , 요일이랑 시간을 같이 받았고 그에 따라 순서대로 sn을 부여해서 다시 저장했다. 
    // spotKey를 sn으로 간주, 요일이랑 시간을 for문으로여러번돌렸던건 음 여기서 seq에따라서 버튼을 클릭한 숫자나, changeUpdate 함수를 타는 target을 새는 방법 이 있을꺼같다.
    // 함수를 타는 파라미터 변수 또는 함수를 몇번 타는지 알 수있는 방법이 있을까?

    //console.log(vm.changeData.clickImg)
    var clickNum = vm.changeData.clickImg
    //console.log(file)

    for (let i = 0; i < clickNum; i++) {
      const file = $("#inputImgFileId")[0].files[0];
      const payload = {
        gongjarueSeq: vm.gongjarueUpdtList.gongjarueSeq[i]
      };

      let uploadFile = {
        "list": vm.gongjarueUpdtList.file[i],
      };
      let paramMap = {
        "gongjarueSeq": vm.gongjarueUpdtList.gongjarueSeq[i],
      };

      console.log(vm.gongjarueUpdtList.gongjarueSeq[i]);
      const gongjarueSeq = vm.gongjarueUpdtList.gongjarueSeq[i];
      //const paramMap = vm.gongjarueUpdtList.gongjarueSeq[i]
      console.log(vm.gongjarueUpdtList.file[i]);
      //const uploadFile = vm.gongjarueUpdtList.file[i]
      console.log(paramMap)
      console.log(uploadFile)
      console.log(JSON.stringify(paramMap))

      formData.append("uploadFile", uploadFile);
      formData.append("paramMap", JSON.stringify(paramMap));
      console.log(formData.values())
    }

    console.log(formData)


    $.sendAjax({
      url: "/experience/updateGongjarueImgList.api",
      data: formData,
      enctype: "multipart/form-data",
      contentType: false,
      processData: false,
      cache: false,
      success: (res) => {
        console.log(res);
      }
    })

    let gongjarueUpdtSaveList = []
    for (var i = 0; i <= clickImg; i++) {
      gongjarueUpdtSaveList.push({
        "gongjarueSeq": vm.UpdtGongjarueModalList.gongjarueSeq[i],
        "gongjarueSj": vm.UpdtGongjarueModalList.gongjarueSj[i],
        "gongjarueCn": vm.UpdtGongjarueModalList.gongjarueCn[i]
      })
    };
    gongjarueUpdtSaveList = vm.UpdtGongjarueModalList
    console.log(gongjarueUpdtSaveList)
    const payload = {
      modalList: vm.UpdtGongjarueModalList
    };

    console.log(e)
    console.log(payload)


    try {
      const res = await event.sendAjaxRequest("/experience/updateGongjarueModalList.api", payload);
      console.log(res);
    } catch (error) {
      console.error("Error while saving:", error);
    }
  },
  clearModal: () => {
    //모달 내용 리셋
    $("#modalSj").val("");
    $("#modalDtls").val("");
  },
  updateSave: (e) => {
    // 이미지 list 로 받아서 저장 (이미지 여러건 반영 기능)
    console.log('적용버튼 사진 저장시작')
    console.log(e)
    const formData = new FormData();

    var clickNum = vm.changeData.clickImg;
    for (let i = 0; i < clickNum; i++) {
      const file = $("#inputImgFileId")[0].files[0]
      vm.gongjarueUpdtSaveList.push({
        "gongjarueSeq": vm.UpdtGongjarueModalList.gongjarueSeq[i],
        "imgList": vm.UpdtGongjarueModalList.file[i]
      });
      const payload = {
        imgList: vm.UpdtGongjarueModalList
      };
      console.log(payload)

      let uploadFile = {
        "imgList": vm.gongjarueUpdtList.file[i],
      };
      console.log(uploadFile)
      let paramMap = {
        "gongjarueSeq": vm.gongjarueUpdtList.gongjarueSeq[i],
      };

      console.log(paramMap)
      console.log(vm.gongjarueUpdtList.gongjarueSeq[i])
      console.log(vm.gongjarueUpdtList.file[i])
      console.log(JSON.stringify(paramMap))

      formData.append("uploadFile", uploadFile);
      formData.append("paramMap", JSON.stringify(paramMap));
    }

    console.log(formData)

    $.sendAjax({
      url: "/experience/updateGongjarueImgList.api",
      data: formData,
      enctype: "multipart/form-data",
      contentType: false,
      processData: false,
      cache: false,
      success: (res) => {
        console.log(res);
      }
    })

    /**
     *   // 이미지 list 로 받아서 저장 (이미지 여러건 반영 기능)
    console.log('적용버튼 사진 저장시작')  

    for (let i = 0; i < clickNum; i++) {
        const file = $("#inputImgFileId")[0].files[0]
        const payload = {
            uploadFile: vm.gongjarueUpdtList.file[i],
            imgList: vm.gongjarueUpdtList.gongjarueSeq[i]
        }

        let uploadFile = {
            "list": vm.gongjarueUpdtList.file[i],
        };
       
        console.log(vm.gongjarueUpdtList.gongjarueSeq[i]) 
        //const paramMap = vm.gongjarueUpdtList.gongjarueSeq[i]
        console.log(vm.gongjarueUpdtList.file[i])
        //const uploadFile = vm.gongjarueUpdtList.file[i] 
        console.log(uploadFile)
        console.log(JSON.stringify(payload))

        formData.append("uploadFile", uploadFile)
        formData.append("paramMap", JSON.stringify(payload));
        console.log(formData.values())
    }

    console.log(formData)


    $.sendAjax({
        url: "/experience/updateGongjarueImgList.api",
        data: formData,
        enctype: "multipart/form-data",
        contentType: false,
        processData: false,
        cache: false,
        success: (res) => {
            console.log(res);
        }
    })
     */
  },
  getGongjarueList: () => {
    // db에 있는 tb_gongjarueSeq값을 가져온다. vm값으로 변환한다. 
    $.sendAjax({
      url: "/experience/selectGongjarueList.api",
      data: vm.searchData,
      contentType: "application/json",
      success: (res) => {
        console.log(res.data)
        vm.gongjarueData = res.data;
        vm.gongjarueList.detailGongjarueCo = res.data.length;

        for (let i = 0; i < 5; i++) {

          vm.sliceData1.push(vm.gongjarueData[i]);

          vm.gongjarueList.gongjarueSeqArray1.push(vm.gongjarueData[i].gongjarueSeq);
          vm.gongjarueList.imageFileSeqArray1.push(vm.gongjarueData[i].imageFileSeq);
          vm.gongjarueList.NumArr1.push(vm.gongjarueData[i].spotKey + 1);
          vm.gongjarueList.imgUrlArr1.push(vm.gongjarueData[i].imgUrl);
          vm.gongjarueList.spotArr1.push(vm.gongjarueData[i].sidePart);


        }
        for (let v = 5; v < 11; v++) {
          // console.log(vm.gongjarueData[v])
          vm.sliceData2.push(vm.gongjarueData[v]);
          vm.gongjarueList.gongjarueSeqArray2.push(vm.gongjarueData[v].gongjarueSeq);
          // vm.gongjarueList.gongjarueSeq2.push(vm.gongjarueData[v].gongjarueSeq)
          vm.gongjarueList.imageFileSeqArray2.push(vm.gongjarueData[v].imageFileSeq);
          vm.gongjarueList.NumArr2.push(vm.gongjarueData[v].spotKey + 1);
          vm.gongjarueList.imgUrlArr2.push(vm.gongjarueData[v].imgUrl);
          vm.gongjarueList.spotArr2.push(vm.gongjarueData[v].sidePart);
        }
        for (let k = 11; k < 16; k++) {
          // console.log(vm.gongjarueData[k])
          vm.sliceData3.push(vm.gongjarueData[k]);
          vm.gongjarueList.gongjarueSeqArray3.push(vm.gongjarueData[k].gongjarueSeq);
          // vm.gongjarueList.gongjarueSeq3.push(vm.gongjarueData[k].gongjarueSeq)
          vm.gongjarueList.imageFileSeqArray3.push(vm.gongjarueData[k].imageFileSeq);
          vm.gongjarueList.NumArr3.push(vm.gongjarueData[k].spotKey + 1);
          vm.gongjarueList.imgUrlArr3.push(vm.gongjarueData[k].imgUrl);
          vm.gongjarueList.spotArr3.push(vm.gongjarueData[k].sidePart);
        }
        for (let d = 16; d <= 23; d++) {
          // console.log(vm.gongjarueData[d])
          vm.sliceData4.push(vm.gongjarueData[d]);
          vm.gongjarueList.gongjarueSeqArray4.push(vm.gongjarueData[d].gongjarueSeq);
          //vm.gongjarueList.gongjarueSeq4.push(vm.gongjarueData[d].gongjarueSeq)
          vm.gongjarueList.imageFileSeqArray4.push(vm.gongjarueData[d].imageFileSeq);
          vm.gongjarueList.NumArr4.push(vm.gongjarueData[d].spotKey + 1);
          vm.gongjarueList.imgUrlArr4.push(vm.gongjarueData[d].imgUrl);
          vm.gongjarueList.spotArr4.push(vm.gongjarueData[d].sidePart);
        }

        // 벌크로 데이터 받는건 vm.gongjarueList.gongjarueSeq, imageFileSeq, gongjarueNum, imgUrl로 받아서 사용 
        // update할때 값 변경되어서 사용가능한지 ,UpdtGongjarueImg 에서 사용해서 param으로 넣을수 있는지, 알아보기
        vm.gongjarueList.gongjarueSeq.push(...vm.gongjarueList.gongjarueSeqArray1);
        vm.gongjarueList.gongjarueSeq.push(...vm.gongjarueList.gongjarueSeqArray2);
        vm.gongjarueList.gongjarueSeq.push(...vm.gongjarueList.gongjarueSeqArray3);
        vm.gongjarueList.gongjarueSeq.push(...vm.gongjarueList.gongjarueSeqArray4);

        vm.gongjarueList.imageFileSeq.push(...vm.gongjarueList.imageFileSeqArray1);
        vm.gongjarueList.imageFileSeq.push(...vm.gongjarueList.imageFileSeqArray2);
        vm.gongjarueList.imageFileSeq.push(...vm.gongjarueList.imageFileSeqArray3);
        vm.gongjarueList.imageFileSeq.push(...vm.gongjarueList.imageFileSeqArray4);

        vm.gongjarueList.gongjarueNum.push(...vm.gongjarueList.NumArr1);
        vm.gongjarueList.gongjarueNum.push(...vm.gongjarueList.NumArr2);
        vm.gongjarueList.gongjarueNum.push(...vm.gongjarueList.NumArr3);
        vm.gongjarueList.gongjarueNum.push(...vm.gongjarueList.NumArr4);

        vm.gongjarueList.imgUrl.push(...vm.gongjarueList.imgUrlArr1);
        vm.gongjarueList.imgUrl.push(...vm.gongjarueList.imgUrlArr2);
        vm.gongjarueList.imgUrl.push(...vm.gongjarueList.imgUrlArr3);
        vm.gongjarueList.imgUrl.push(...vm.gongjarueList.imgUrlArr4);

        event.setGongjaruePicList(res.data);
      },
      error: function (e) {
        $.alert(e.responseJSON.message);
      }
    });

  },
  setGongjaruePicList: (data) => {
    // 이미지 src를 fileSeq로 받아서 하드코딩
    document.getElementById('gongjarue1Img1').src = `/cmmn/fileDownload.api?fileSeq=${vm.gongjarueList.imageFileSeqArray1[0]}`;
    document.getElementById('gongjarue1Img2').src = `/cmmn/fileDownload.api?fileSeq=${vm.gongjarueList.imageFileSeqArray1[1]}`;
    document.getElementById('gongjarue1Img3').src = `/cmmn/fileDownload.api?fileSeq=${vm.gongjarueList.imageFileSeqArray1[2]}`;
    document.getElementById('gongjarue1Img4').src = `/cmmn/fileDownload.api?fileSeq=${vm.gongjarueList.imageFileSeqArray1[3]}`;
    document.getElementById('gongjarue1Img5').src = `/cmmn/fileDownload.api?fileSeq=${vm.gongjarueList.imageFileSeqArray1[4]}`;


    document.getElementById('gongjarue2Img1').src = `/cmmn/fileDownload.api?fileSeq=${vm.gongjarueList.imageFileSeqArray2[0]}`;
    document.getElementById('gongjarue2Img2').src = `/cmmn/fileDownload.api?fileSeq=${vm.gongjarueList.imageFileSeqArray2[1]}`;
    document.getElementById('gongjarue2Img3').src = `/cmmn/fileDownload.api?fileSeq=${vm.gongjarueList.imageFileSeqArray2[2]}`;
    document.getElementById('gongjarue2Img4').src = `/cmmn/fileDownload.api?fileSeq=${vm.gongjarueList.imageFileSeqArray2[3]}`;
    document.getElementById('gongjarue2Img5').src = `/cmmn/fileDownload.api?fileSeq=${vm.gongjarueList.imageFileSeqArray2[4]}`;
    document.getElementById('gongjarue2Img6').src = `/cmmn/fileDownload.api?fileSeq=${vm.gongjarueList.imageFileSeqArray2[5]}`;


    document.getElementById('gongjarue3Img1').src = `/cmmn/fileDownload.api?fileSeq=${vm.gongjarueList.imageFileSeqArray3[0]}`;
    document.getElementById('gongjarue3Img2').src = `/cmmn/fileDownload.api?fileSeq=${vm.gongjarueList.imageFileSeqArray3[1]}`;
    document.getElementById('gongjarue3Img3').src = `/cmmn/fileDownload.api?fileSeq=${vm.gongjarueList.imageFileSeqArray3[2]}`;
    document.getElementById('gongjarue3Img4').src = `/cmmn/fileDownload.api?fileSeq=${vm.gongjarueList.imageFileSeqArray3[3]}`;
    document.getElementById('gongjarue3Img5').src = `/cmmn/fileDownload.api?fileSeq=${vm.gongjarueList.imageFileSeqArray3[4]}`;


    document.getElementById('gongjarue4Img1').src = `/cmmn/fileDownload.api?fileSeq=${vm.gongjarueList.imageFileSeqArray4[0]}`;
    document.getElementById('gongjarue4Img2').src = `/cmmn/fileDownload.api?fileSeq=${vm.gongjarueList.imageFileSeqArray4[1]}`;
    document.getElementById('gongjarue4Img3').src = `/cmmn/fileDownload.api?fileSeq=${vm.gongjarueList.imageFileSeqArray4[2]}`;
    document.getElementById('gongjarue4Img4').src = `/cmmn/fileDownload.api?fileSeq=${vm.gongjarueList.imageFileSeqArray4[3]}`;
    document.getElementById('gongjarue4Img5').src = `/cmmn/fileDownload.api?fileSeq=${vm.gongjarueList.imageFileSeqArray4[4]}`;
    document.getElementById('gongjarue4Img3').src = `/cmmn/fileDownload.api?fileSeq=${vm.gongjarueList.imageFileSeqArray4[5]}`;
    document.getElementById('gongjarue4Img4').src = `/cmmn/fileDownload.api?fileSeq=${vm.gongjarueList.imageFileSeqArray4[6]}`;
    document.getElementById('gongjarue4Img5').src = `/cmmn/fileDownload.api?fileSeq=${vm.gongjarueList.imageFileSeqArray4[7]}`;

  },
  modalSave: async (e) => {
    //모달 제목,내용을 array -> 객체 List로 만들어서 저장한다. 
    console.log('modalSave 함수진입');
    // vm.UpdtGongjarueModalList는 배열로 {'gogjarueSeq':['GONGJARUE_00000012','GONGJARUE_00000011'],gongjarueSj:['ttttt','ddddd'],gongjarueSn:['tt','dd']} 로 나온다. 

    // vm.UpdtGongjarueModalList는 vm.gongjarueUpdtSaveList 에서 객체 List로 바뀐다.
    // [{"gongjarueSeq": "GONGJARUE_00000012","gongjarueSj": "tt","gongjarueCn": "ttttt"},{"gongjarueSeq": "GONGJARUE_00000011","gongjarueSj": "tt","gongjarueCn": "ttttt"} ] 
    for (var i = 0; i < clickImg; i++) {
      vm.gongjarueUpdtSaveList.push({
        "gongjarueSeq": vm.UpdtGongjarueModalList.gongjarueSeq[i],
        "gongjarueSj": vm.UpdtGongjarueModalList.gongjarueSj[i],
        "gongjarueCn": vm.UpdtGongjarueModalList.gongjarueCn[i]
      })
    };
    const payload = {
      modalList: vm.gongjarueUpdtSaveList
    };
    console.log(payload)
    try {
      const res = await event.sendAjaxRequest("/experience/updateGongjarueModalList.api", payload);
      console.log(res);
    } catch (error) {
      console.error("Error while saving:", error);
    }
  },
  dataBindingForSend: (e) => {
    // 모달text를 vm변수값에 할당한다.
    let gongjaruesj = $("#modalSj");
    let gongjaruecn = $("#modalDtls");
    console.log($("#modalSj").val());
    console.log(gongjaruecn.val());
    vm.UpdtGongjarueModal.gongjarueSj = gongjaruesj.val();
    vm.UpdtGongjarueModal.gongjarueCn = gongjaruecn.val();
    vm.UpdtGongjarueModal.gongjarueSeq = vm.changeData.inputNum2;
    vm.UpdtGongjarueModalList.gongjarueCn.push(vm.UpdtGongjarueModal.gongjarueCn);
    vm.UpdtGongjarueModalList.gongjarueSj.push(vm.UpdtGongjarueModal.gongjarueSj);
    vm.UpdtGongjarueModalList.gongjarueSeq.push(vm.UpdtGongjarueModal.gongjarueSeq);
    vm.UpdtGongjarueModalList2.push(vm.UpdtGongjarueModalList);
    console.log(vm.UpdtGongjarueModalList2);
  },
  fileValidation: function (obj) {
    const fileTypes = ['image'];
    if (obj.name.length > 100) {
      $.alert("파일명이 100자 이상인 파일은 제외되었습니다.");
      return false;
    } else if (obj.size > (100 * 1024 * 1024)) {
      $.alert("최대 파일 용량인 100MB를 초과한 파일은 제외되었습니다.");
      return false;
    } else if (obj.name.lastIndexOf('.') == -1) {
      $.alert("확장자가 없는 파일은 제외되었습니다.");
      return false;
    } else if (!fileTypes.includes(obj.type.split('/')[0])) {
      $.alert("첨부가 불가능한 파일은 제외되었습니다.");
      return false;
    } else {
      return true;
    }
  },
  sendAjaxRequest: (url, data) => {
    return new Promise((resolve, reject) => {
      $.sendAjax({
        url,
        data,
        contentType: "application/json",
        success: (response) => resolve(response),
        error: (e) => reject(e)
      });
    });
  },
};


$(document).ready(() => {
  vueInit();
  event.init();
  event.getGongjarueList();
});