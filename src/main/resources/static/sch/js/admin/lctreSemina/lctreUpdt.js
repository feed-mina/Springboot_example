let vueData = {
    lctreData: {
        startHour: "",				//강의 시작 시간
        startMinute: "",			//강의 시작 분
        endHour: "",				//강의 종료 시간
        endMinute: "",				//강의 종료 분
        startDt: "",				//강의 기간 시작일자
        endDt: "",					//강의 기간 종료일자
        startPeriodDt: "",			//모집기간 시작일자
        endPeriodDt: "",			//모집기간 종료일자
        startPeriodHour: "",		//모집기간 시작시간
        startPeriodMinute: "",		//모집기간 시작분
        endPeriodHour: "",			//모집기간 종료시간
        endPeriodMinute: "",		//모집기간 종료분
        lctreKndCode: "",			//강의 종류
        specialLctreYn: false,		//특강여부
        specialLctreYnStr: "",		//특강여부 리터럴값
        lctreNm: "",				//강의명
        userNm: "",                 //교수명
        userEmail: "",              //교수이메일
        profsrUserSeq: "",	        //교수이용자일련
        studentMax: 300, 			//최대 수강생 수
        lctreMax: 100, 				//최대 강좌수 -> 최대 100개까지 등록 가능
        lctreNum: [],				//전체 강좌 수 -> length로 카운팅
        lctreDayArray: [],			//강의요일
        lctrePlace: "",				//강의장소
        userKndCodeArray: [], 		//회원 종류
        studentCount: "", 			//수강생 수
        lctreFile: "",				//강의 대표 이미지
        lctreDescription: "",		//강의설명
        lctreDetailSubjectArray: [],//강좌 디테일 제목 배열
        lctreDetailOutlineArray: [],//강좌 디테일 개요 배열
        lctreKeywordArray: [],		//검색 키워드
        lctreCountArray: [],		//강좌일정
        lctreSttusArray: [],        //강좌상태
        detailLctreCountStr: "",    //전체강좌수 리터럴 (e.g: 3강)
        detailLctreCo: "",          //전체강좌수
        originDetailLctreCo: "",    //전체강좌수 저장 변수
        lctreStatus: "",            //모집 상태
        lctreSttusSe: "",            //강의 상태구분
        lctreSeq: "",                //강의일련
        lctreBeginHourArr: [],      //강좌별 강의시작 시간
        lctreBeginMinuteArr: [],    //강좌별 강의시작 분
        lctreEndHourArr: [],        //강좌별 강의종료시간
        lctreEndMinuteArr: [],      //강좌별 강의종료시간
        smtmIntrprNm: "",          //동시통역명
        smtmIntrprEmail: "",          //동시통역이메일
        smtmIntrprSeq: "",          //동시통역일련
    },
    authorList: [],					//commonCode에서 받아온 회원 종류 리스트
    lctreKndCodeList: [],			//commonCode에서 받아온 강의 종류 리스트
    totalUserList: [],
    userListFilteredByAuthor: [],
    userListFilteredByKeyword: [],
    userList: [],
    preview: "/image/no_img.png",
    searchData: {
        deletedLctreInclude: false,
        authorOne: "",
        searchText: '',
        pageNo: 1,
        pageLength: 10
    },
    userSearchModalType: "",
}

let userSearchObj = {
    'profsr':
        {'authorType':'PR', 'userAuthorNm':'교수',},
};

let vm;

let vueInit = () => {
    const app = Vue.createApp({
        data() {
            return vueData;
        },
        computed: {
            optionsWithStep() {
                const step = 10;
                const max = this.lctreData.studentMax;
                const options = [];

                for (let i = 10; i <= max; i += step) {
                    options.push(i);
                }

                return options;
            }
        },
        methods: {
            hourValidation: function (e) {
                e.target.value = util.formmater.hourFormatter(e.target.value);
            },
            minuteValidation: function (e) {
                e.target.value = util.formmater.minuteFormatter(e.target.value);
            },
            selectCmmnCode: () => {
                let paramList = [
                    {upperCmmnCode: "AUTHOR", cmmnCodeEtc: "LCTRE_USER"},
                    {upperCmmnCode: "LCTRE_KND_CODE"}
                ];

                for (let i = 0; i < paramList.length; i++) {
                    $.sendAjax({
                        url: "/cmmn/selectCmmnCode.api",
                        data: paramList[i],
                        contentType: "application/json",
                        success: (res) => {
                            switch (paramList[i].upperCmmnCode) {
                                case 'AUTHOR':
                                    vm.authorList = res.data;
                                    break;
                                case 'LCTRE_KND_CODE':
                                    vm.lctreKndCodeList = res.data;
                                    break;
                            }
                        },
                        error: function (e) {
                            $.alert(e.responseJSON.message);
                        },
                    });
                }
            },
            createKeyword: (e) => {
                let flag = util.validator.isSearchKeyword(e, 30);

                if (flag) {
                    let keywordTag = "<div class='keyword dp_center side-by-side'>" + e.target.value + "<button id='deleteKeyword' type='button' @click='deleteKeyword'><img src='/image/close.png' class='delete-keyword-btn'/></button></div>";
                    $("#keywordContainer").append(keywordTag);
                    e.target.value = "";
                }
            },
            fnAddIconClick: (e) => {
                $("#inputLctreImgFile").click();
            },
            fnSave: event.fnSave,
            fnCancel: function () {
                $.confirm("지금까지 수정한 내용이 모두 사라집니다.정말 취소하시겠습니까?", () => {
                    $.alert("입력한 내용이 취소되었습니다.", () => {
                        //내용초기화
                        event.getLectureDetail();
                    });
                })
            },
            // fnDetail: event.fnDetail,
            fnModalCancel: function () {
                event.clearModal();
            },
            fnModalSave: function () {
                if (!event.modalValidation()) {
                    return false;
                }
                vm.lctreData.lctreDetailSubjectArray.push($("#modalSj").val());
                vm.lctreData.lctreDetailOutlineArray.push($("#modalDtls").val());
                vm.lctreData.lctreBeginHourArr.push($("#modalStartHour").val());
                vm.lctreData.lctreBeginMinuteArr.push($("#modalStartMinute").val());
                vm.lctreData.lctreEndHourArr.push($("#modalEndHour").val());
                vm.lctreData.lctreEndMinuteArr.push($("#modalEndMinute").val());

                vm.lctreData.detailLctreCountStr = vm.lctreData.lctreDetailSubjectArray.length + "강";    //전체강좌수 리터럴 (e.g: 3강)
                vm.lctreData.detailLctreCo = vm.lctreData.lctreDetailSubjectArray.length;
                vm.lctreData.lctreSttusArray.push("진행 예정");
                vm.lctreData.lctreNum.push("");

                vm.lctreData.lctreCountArray.push("");
                $.alert("강좌가 추가되었습니다.", () => {
                    $('#lctreFxAddModal').modal('hide');
                    datepicker();
                    $.datepicker.setDefaults({
                        changeMonth: false,
                        changeYear: false,
                    });
                    $(".addedLctreDate").datepicker("option", "minDate", util.date.getSubDate());
                });
            },
            fnUserModalCancel: function () {
                $("input:checkbox[name='userKndCodeInUserSearch']").prop('checked', false);
            },
            userSearch: function () {
                $("#userSearchBtn").click();
            },
        }
    })
    vm = app.mount('#content');
}

let event = {
    init: () => {
        $(document).on("click", "#deleteKeyword", function (e) {
            if (e.target.tagName === 'BUTTON') {
                e.target.parentElement.remove();
            } else if (e.target.tagName === 'IMG') {
                e.target.parentElement.parentElement.remove();
            }
        });
        $('#profsrName').on('click', function (e) {
            vm.userSearchModalType = "profsr";
            $('#userSearchModal').modal('show');
            event.userSearchModal();
        });
        $('#profsrNameBtn').on('click', function (e) {
            vm.userSearchModalType = "profsr";
            $('#userSearchModal').modal('show');
            event.userSearchModal();
        });
        $('#smtmIntrpr').on('click', function (e) {
            vm.userSearchModalType = "smtmIntrpr";
            $('#userSearchModal').modal('show');
            event.userSearchModalDefault();
        });
        $('#smtmIntrprBtn').on('click', function (e) {
            vm.userSearchModalType = "smtmIntrpr";
            $('#userSearchModal').modal('show');
            event.userSearchModalDefault();
        });
        $('#userSearchBtn').on('click', function (e) {
            if(vm.searchData.searchText ==='') {
                if (vm.userSearchModalType === "smtmIntrpr") {
                    vm.userListFilteredByAuthor = vm.totalUserList;
                    vm.userList = vm.userListFilteredByAuthor;
                } else {
                    let currentAuthorType = userSearchObj[vm.userSearchModalType].authorType;
                    vm.userListFilteredByAuthor = vm.totalUserList.filter(user => user.userAuthor === currentAuthorType);
                    vm.userList = vm.userListFilteredByAuthor;
                }
            } else {
                vm.userListFilteredByKeyword = vm.userListFilteredByAuthor.filter(user => user.userEmail.includes(keyword) || user.userNm.includes(keyword));
                vm.userList = vm.userListFilteredByKeyword;
            }
        });
        $('#userSearchInput').on('enter', function (e) {
            if(vm.searchData.searchText ==='') {
                if (vm.userSearchModalType === "smtmIntrpr") {
                    vm.userListFilteredByAuthor = vm.totalUserList;
                    vm.userList = vm.userListFilteredByAuthor;
                } else {
                    let currentAuthorType = userSearchObj[vm.userSearchModalType].authorType;
                    vm.userListFilteredByAuthor = vm.totalUserList.filter(user => user.userAuthor === currentAuthorType);
                    vm.userList = vm.userListFilteredByAuthor;
                }
            } else {
                vm.userListFilteredByKeyword = vm.userListFilteredByAuthor.filter(user => user.userEmail.includes(keyword) || user.userNm.includes(keyword));
                vm.userList = vm.userListFilteredByKeyword;
            }
        });
        $('#userSearchModal').on('shown.bs.modal', function (e) {
            vm.searchData.searchText = "";
            $("input:checkbox[name='userKndCodeInUserSearch']").prop('checked', false);
        });
        $('#userSearchModal').on('hidden.bs.modal', function (e) {
            vm.searchData.searchText = "";
            $("input:checkbox[name='userKndCodeInUserSearch']").prop('checked', false);
        });
        $("input[name='lctreDayArray']").on('change', function (e) {
            if (vm.lctreData.startDt !== "" && vm.lctreData.endDt !== "" && vm.lctreData.lctreDayArray.length > 0) {
                $("#detailLctreCount").removeAttr("disabled");
            } else {
                $("#detailLctreCount").attr("disabled", "true");
            }
        });
        $('#inputLctreImgFile').on('change', function (obj) {
            event.addFile(obj);
        });
        /* 모집기간 datepicker는 레벨이 달라서 수동으로 minDate, maxDate설정함 */
        $(document).on("change", "#startPeriodDt", function (e) {
            $("#endPeriodDt").datepicker("option", "minDate", this.value);
        });
        $(document).on("change", "#endPeriodDt", function (e) {
            $("#endPeriodDt").datepicker("option", "maxDate", this.value);
        });
        $(document).on("change", "input[id='ALL']", function (e) {
            let checkedStatus = e.target.checked;
            util.changeCheckedStatus(checkedStatus, "userKndCode");
        });
        $(document).on("click", "#deleteProfessor", function (e) {
            $("#professor").children().remove();
        });
        $(document).on("click", "#closeModal", function (e) {
            event.clearModal();
        });
        $(document).on("click", "#btnUserSearchModalSave", function (e) {
            if (vm.userSearchModalType === "profsr") {
                let userEmail = "";
                let userNm = "";
                let userSeqEl = $("input:checkbox[name='userKndCodeInUserSearch']:checked");
                let userSeq = userSeqEl[0].id;
                for (let i = 0; i < vm.userList.length; i++) {
                    if (vm.userList[i].userSeq === userSeq) {
                        userEmail = vm.userList[i].userEmail;
                        userNm = vm.userList[i].userNm;
                        break;
                    }
                }
                $(".deleteProfessorUser").parent().remove();
                vm.lctreData.profsrUserSeq = userSeq;
                event.makeProfessorUserTag();
                $('#userSearchModal').modal('hide');
                return true;
            } else if (vm.userSearchModalType === "smtmIntrpr") {
                let userEmail = "";
                let userNm = "";
                let userSeqEl = $("input:checkbox[name='userKndCodeInUserSearch']:checked");
                let userSeq = userSeqEl[0].id;
                for (let i = 0; i < vm.userList.length; i++) {
                    if (vm.userList[i].userSeq === userSeq) {
                        userEmail = vm.userList[i].userEmail;
                        userNm = vm.userList[i].userNm;
                        break;
                    }
                }
                $(".deleteSmtmIntrprUser").parent().remove();
                vm.lctreData.smtmIntrprSeq = userSeq;
                event.makeSmtmIntrprUserTag();
                $('#userSearchModal').modal('hide');
                return true;
            }
        });
        $(document).on("change", "input[name=userKndCodeInUserSearch]", function (e) {
            let userKndCodeCheck = $("input:checkbox[name='userKndCodeInUserSearch']:checked");
            if (userKndCodeCheck.length > 1) {
                for (let i = 1; i < userKndCodeCheck.length; i++) {
                    userKndCodeCheck[i].checked = false;
                }
            }
        });
        $(document).on("click", ".deleteProfessorUser", function (e) {
            vm.lctreData.profsrUserSeq = "";
        });
        $(document).on("click", ".deleteSmtmIntrprUser", function (e) {
            vm.lctreData.smtmIntrprSeq = "";
        });
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
    fnSave: () => {
        event.dataBindingForSend();

        //필수 입력 validation
        if (!event.validation()) {
            return false;
        }

        $.sendAjax({
            url: "/lctreController/updateLctreAndLctreFxAndLctreKwrd.api",
            data: vm.lctreData,
            contentType: "application/json",
            success: (res) => {
                $.alert("강의 개설 내용이 수정되었습니다. 강의 개설 목록으로 이동합니다.", () => {
                    location.href = "lctreList.html";
                });
            },
            error: function (e) {
                $.alert(e.responseJSON.message);
            },
        });
    },
    getDayIndex: (startDtDay) => {
        return util.date.getDayIndex(startDtDay);
    },
    addFile: async function (e) {
        // 첨부파일 검증
        $.each(e.target.files, function (i, val) {
            if (!event.fileValidation(val)) {
                return false;
            }
        });

        const compressedFile = await util.getCompressed(e.target.files[0]);
        util.blobToBase64(compressedFile).then(function (compressedFile) {
            vm.preview = compressedFile;
            vm.lctreData.lctreFile = compressedFile;
        });
    },
    validation: () => {
        if (vm.lctreData.lctreKndCode === "") {
            $.alert("강의 종류를 선택하세요.");
            return false;
        } else if (vm.lctreData.lctreNm.trim() === "") {
            $.alert("강의명을 입력해주세요.");
            return false;
        } else if (vm.lctreData.userNm.trim() === "") {
            $.alert("교수명을 입력해주세요.");
            return false;
        } else if (vm.lctreData.startDt.trim() === "") {
            $.alert("강의 기간 시작일자를 입력해주세요.");
            return false;
        } else if (vm.lctreData.endDt.trim() === "") {
            $.alert("강의 기간 종료일자를 입력해주세요.");
            return false;
        } else if (vm.lctreData.startHour.trim() === "") {
            $.alert("강의 시작 시간을 입력해주세요.");
            return false;
        } else if (vm.lctreData.startMinute.trim() === "") {
            $.alert("강의 시작 분을 입력해주세요.");
            return false;
        } else if (vm.lctreData.endHour.trim() === "") {
            $.alert("강의 종료 시간을 입력해주세요.");
            return false;
        } else if (vm.lctreData.endMinute.trim() === "") {
            $.alert("강의 종료 분을 입력해주세요.");
            return false;
        } else if (vm.lctreData.lctreDayArray.length <= 0) {
            $.alert("강의 요일을 선택하세요.");
            return false;
        } else if (vm.lctreData.lctrePlace.trim() === "") {
            $.alert("강의 장소를 입력해주세요.");
            return false;
        } else if (vm.lctreData.startPeriodDt.trim() === "") {
            $.alert("모집기간 시작일자를 입력해주세요.");
            return false;
        } else if (vm.lctreData.startPeriodHour.trim() === "") {
            $.alert("모집기간 시작시간을 입력해주세요.");
            return false;
        } else if (vm.lctreData.startPeriodMinute.trim() === "") {
            $.alert("모집기간 시작분을 입력해주세요.");
            return false;
        } else if (vm.lctreData.endPeriodDt.trim() === "") {
            $.alert("모집기간 종료일자를 입력해주세요.");
            return false;
        } else if (vm.lctreData.endPeriodHour.trim() === "") {
            $.alert("모집기간 종료시간을 입력해주세요.");
            return false;
        } else if (vm.lctreData.endPeriodMinute.trim() === "") {
            $.alert("모집기간 종료분을 입력해주세요.");
            return false;
        } else if (vm.lctreData.userKndCodeArray.length <= 0) {
            $.alert("회원 종류를 선택해주세요.");
            return false;
        } else if (vm.lctreData.studentCount === "") {
            $.alert("수강생 수를 선택해주세요.");
            return false;
        } else if (vm.lctreData.lctreFile === "") {
            $.alert("강의 대표이미지를 선택해주세요.");
            return false;
        } else if (vm.lctreData.lctreDescription.trim() === "") {
            $.alert("강의 설명을 입력해주세요.");
            return false;
        } else if (vm.lctreData.lctreNum.length <= 0) {
            $.alert("전체 강좌 수를 선택해주세요.");
            return false;
        } else if (vm.lctreData.lctreKeywordArray.length <= 0) {
            $.alert("검색 키워드를 등록해주세요.");
            return false;
        }

        if (vm.lctreData.startPeriodHour > 23) {
            $.alert("모집기간 시작 시간을 올바르게 입력해주세요.");
            return false;
        } else if (vm.lctreData.startPeriodMinute > 59) {
            $.alert("모집기간 시작분을 올바르게 입력해주세요.");
            return false;
        } else if (vm.lctreData.endPeriodHour > 23) {
            $.alert("모집기간 종료 시간을 올바르게 입력해주세요.");
            return false;
        } else if (vm.lctreData.endPeriodMinute > 59) {
            $.alert("모집기간 종료분을 올바르게 입력해주세요.");
            return false;
        }

        if ((vm.lctreData.startPeriodDt === vm.lctreData.endPeriodDt) && (vm.lctreData.startPeriodHour + vm.lctreData.startPeriodMinute) >= (vm.lctreData.endPeriodHour + vm.lctreData.endPeriodMinute)) {
            $.alert("모집기간 시작일시는 종료일시보다 이른 시간이어야 합니다.");
            return false;
        }

        for (let i = 0; i < vm.lctreData.lctreCountArray.length; i++) {
            if (vm.lctreData.lctreCountArray[i] === "") {
                $.alert("제 " + (i+1) + "강 강의 날짜를 입력해주세요.");
                return false;
            } else if (vm.lctreData.lctreCountArray[i].length !== 10) {
                $.alert("제 " + (i+1) + "강 강의 날짜를 올바르게 입력해주세요.");
                return false;
            }
        }

        for (let i = 0; i < vm.lctreData.lctreBeginHourArr.length; i++) {
            if (vm.lctreData.lctreBeginHourArr[i] > 23) {
                $.alert("제 " + (i+1) + "강 시작 시간을 올바르게 입력해주세요.");
                return false;
            } else if (vm.lctreData.lctreBeginMinuteArr[i] > 59) {
                $.alert("제 " + (i+1) + "강 시작 분을 올바르게 입력해주세요.");
                return false;
            } else if (vm.lctreData.lctreEndHourArr[i] > 23) {
                $.alert("제 " + (i+1) + "강 종료 시간을 올바르게 입력해주세요.");
                return false;
            } else if (vm.lctreData.lctreEndMinuteArr[i] > 59) {
                $.alert("제 " + (i+1) + "강 종료 분을 올바르게 입력해주세요.");
                return false;
            }
        }

        let lctreCountLen = vm.lctreData.lctreCountArray.length;
        let set = new Set(vm.lctreData.lctreCountArray);
        if (lctreCountLen > set.size) {
            $.alert("추가된 강좌의 일자를 기존 강좌들과 겹치지 않게 입력해주세요.");
            return false;
        }

        return true;
    },
    dataBindingForSend: () => {
        //검색 키워드 모델에 담기
        let keywordList = $(".keyword");
        vm.lctreData.lctreKeywordArray = [];
        for (let i = 0; i < keywordList.length; i++) {
            vm.lctreData.lctreKeywordArray.push(keywordList[i].innerText);
        }

        //회원종류 모델에 담기
        let userKndCode = $("input[name='userKndCode']");
        vm.lctreData.userKndCodeArray = [];
        for (let i = 0; i < userKndCode.length; i++) {
            if (userKndCode[i].checked === true) {
                vm.lctreData.userKndCodeArray.push(userKndCode[i].id);
            }
        }

        if (vm.lctreData.userKndCodeArray.includes('ALL')) {
            vm.lctreData.userKndCodeArray = [];
            vm.lctreData.userKndCodeArray.push('ALL');
        }

        // 특강여부 모델에 담기
        if (vm.lctreData.specialLctreYn === true) {
            vm.lctreData.specialLctreYnStr = 'Y';
        } else {
            vm.lctreData.specialLctreYnStr = 'N';
        }

        //강의요일 정렬하기
        vm.lctreData.lctreDayArray.sort();
    },
    getLectureDetail: () => {
        let urlParams = new URL(location.href).searchParams;
        let lctreSeq = urlParams.get('lctreSeq');
        let paramMap = {'lctreSeq': lctreSeq};
        $.sendAjax({
            url: "/lctreController/selectLctre.api",
            data: paramMap,
            contentType: "application/json",
            success: async (res) => {
                let resData = res.data;
                await event.setLctre(resData);
                $.sendAjax({
                    url: "/lctreController/selectLctrePlanList.api",
                    data: paramMap,
                    contentType: "application/json",
                    success: async (lctreFxRes) => {
                        await event.setLctreFx(lctreFxRes.data);
                    },
                    error: function (e) {
                        $.alert(e.responseJSON.message);
                    },
                });
            }
            , error: function (e) {
                $.alert(e.responseJSON.message);
            }
        });
    },
    setLctre: (resData) => {
        $("#keywordContainer").children().remove();

        vm.lctreData.startHour = resData.lctreBeginTime.substring(0, 2);			//강의 시작 시간
        vm.lctreData.startMinute = resData.lctreBeginTime.substring(2, 4);			//강의 시작 분
        vm.lctreData.endHour = resData.lctreEndTime.substr(0, 2);		//강의 종료 시간
        vm.lctreData.endMinute = resData.lctreEndTime.substr(2, 2);		//강의 종료 분
        vm.lctreData.startDt = util.date.addDateDash(resData.lctreBeginDe);			//강의 기간 시작일자
        vm.lctreData.endDt = util.date.addDateDash(resData.lctreEndDe);				//강의 기간 종료일자
        vm.lctreData.startPeriodDt = resData.rcritBeginDt.substring(0, 10);			//모집기간 시작일자
        vm.lctreData.endPeriodDt = resData.rcritEndDt.substring(0, 10);				//모집기간 종료일자
        vm.lctreData.startPeriodHour = resData.rcritBeginDt.substring(11, 13);		//모집기간 시작시간
        vm.lctreData.startPeriodMinute = resData.rcritBeginDt.substring(14, 16);	//모집기간 시작분
        vm.lctreData.endPeriodHour = resData.rcritEndDt.substring(11, 13);			//모집기간 종료시간
        vm.lctreData.endPeriodMinute = resData.rcritEndDt.substring(14, 16);		//모집기간 종료분

        vm.lctreData.lctreKndCode = resData.lctreKndCode;							//강의 종류

        let tempSpecialLctreYnStr = resData.speclLctreAt;							//특강여부
        if (tempSpecialLctreYnStr === 'Y') {
            vm.lctreData.specialLctreYn = true;
        } else if (tempSpecialLctreYnStr === 'N') {
            vm.lctreData.specialLctreYn = false;
        }

        vm.lctreData.lctreNm = resData.lctreNm;									    //강의명
        vm.lctreData.userNm = resData.userNm;				                        //교수명
        vm.lctreData.userEmail = resData.userEmail;				                    //교수 이메일
        vm.lctreData.profsrUserSeq = resData.profsrUserSeq;	                        //교수이용자일련
        vm.lctreData.smtmIntrprNm = resData.smtmIntrprNm;				            //동시통역명
        vm.lctreData.smtmIntrprEmail = resData.smtmIntrprEmail;				        //동시통역이메일
        vm.lctreData.smtmIntrprSeq = resData.smtmIntrprSeq;	                        //동시통역일련
        vm.lctreData.lctreNum.length = resData.detailLctreCo;						//전체 강좌 수 -> length로 카운팅
        vm.lctreData.originDetailLctreCo = resData.detailLctreCo;                   //디비에서 가져온 전체 강좌수 변수에 저장
        vm.lctreData.detailLctreCo = resData.detailLctreCo;
        vm.lctreData.detailLctreCountStr = resData.detailLctreCo + "강";             //전체강좌수 리터럴 (e.g: 3강)
        vm.lctreData.lctreDayArray = [];
        let tempLctreWeekArray = resData.lctreWeekArray.split(",");				//강의요일
        for (let i = 0; i < tempLctreWeekArray.length; i++) {
            let dayValue = tempLctreWeekArray[i];
            vm.lctreData.lctreDayArray.push(dayValue);
            $("input:checkbox[value=dayValue]").prop("checked", true);
        }
        vm.lctreData.lctrePlace = resData.lctrePlaceNm;								//강의장소
        let tempuserKndCodeArray = resData.atnlcAuthorArray.split(",");
        ; 			//회원 종류
        let tempStr = "";
        vm.lctreData.userKndCodeArray = [];
        for (let i = 0; i < tempuserKndCodeArray.length; i++) {
            tempStr = tempuserKndCodeArray[i];
            vm.lctreData.userKndCodeArray.push(tempStr);
            $("input[id=" + tempStr + "]").prop("checked", true);
        }
        vm.lctreData.studentCount = resData.atnlcCo; 								//수강생 수
        vm.lctreData.lctreFile = resData.lctreImageCn;								//강의 대표 이미지
        vm.preview = resData.lctreImageCn;
        vm.lctreData.lctreFile = resData.lctreImageCn;
        vm.lctreData.lctreDescription = resData.lctreDc;							//강의설명
        vm.lctreData.lctreKeywordArray = [];										//검색 키워드
        let tempKeywordArray = resData.lctreKwrd.split(",");
        for (let i = 0; i < tempKeywordArray.length; i++) {
            let keyword = tempKeywordArray[i];

            let keywordTag = "<div class='keyword dp_center side-by-side'>" + keyword + "<button id='deleteKeyword' type='button' @click='deleteKeyword'><img src='/image/close.png' class='delete-keyword-btn'/></button></div>";
            $("#keywordContainer").append(keywordTag);

            vm.lctreData.lctreKeywordArray.push(keyword);
        }

        vm.lctreData.lctreStatus = resData.lctreStatus;
        vm.lctreData.lctreSttusSe = resData.lctreSttusSe;
        vm.lctreData.lctreSeq = resData.lctreSeq;
    },
    setLctreFx: (resData) => {
        let today = new Date();

        for (let i = 0; i < resData.length; i++) {
            let temp = resData[i].lctreSj;
            vm.lctreData.lctreDetailSubjectArray.push(resData[i].lctreSj);
            vm.lctreData.lctreDetailOutlineArray.push(resData[i].lctreDtls);
            vm.lctreData.lctreCountArray.push(util.date.addDateDash(resData[i].lctreDt));

            let lctreDateStr = util.date.addDateDash(resData[i].lctreDt) + " " + resData[i].lctreEndTime.substring(0, 2) + ":" + resData[i].lctreEndTime.substring(2) + ":00";
            let lctreDate = new Date(lctreDateStr);
            let lctreSttusStr = "";

            if (resData[i].useAt === 'N') {
                lctreSttusStr = "휴강";
            } else if (lctreDate < today) {
                lctreSttusStr = "완료";
            } else {
                lctreSttusStr = "진행 예정";
            }

            vm.lctreData.lctreSttusArray.push(lctreSttusStr);

            vm.lctreData.lctreBeginHourArr.push(resData[i].lctreBeginTime.substring(0, 2));
            vm.lctreData.lctreBeginMinuteArr.push(resData[i].lctreBeginTime.substring(2));
            vm.lctreData.lctreEndHourArr.push(resData[i].lctreEndTime.substring(0, 2));
            vm.lctreData.lctreEndMinuteArr.push(resData[i].lctreEndTime.substring(2));
        }

        //강의시작일자와 강의종료일자로 범위 제한
        $(".lctreFx").datepicker("option", "minDate", new Date(vm.lctreData.startDt));
        $(".lctreFx").datepicker("option", "maxDate", new Date(vm.lctreData.endDt));
    },
    clearModal: () => {
        //모달 내용 리셋
        $("#modalSj").val("");
        $("#modalDtls").val("");
        $("#modalAddLctreDt").val("");
        $("#modalStartHour").val("");
        $("#modalStartMinute").val("");
        $("#modalEndHour").val("");
        $("#modalEndMinute").val("");
    },
    modalValidation: () => {
        if ($("#modalSj").val() === "") {
            $.alert("강좌 제목을 입력하세요.");
            return false;
        } else if ($("#modalDtls").val() === "") {
            $.alert("강좌 개요를 입력해주세요.");
            return false;
        } else if ($("#modalStartHour").val() === "") {
            $.alert("강좌 시작 시간을 입력해주세요.");
            return false;
        } else if ($("#modalStartMinute").val() === "") {
            $.alert("강좌 시작 분을 입력해주세요.");
            return false;
        } else if ($("#modalEndHour").val() === "") {
            $.alert("강좌 종료 시간을 입력해주세요.");
            return false;
        } else if ($("#modalEndMinute").val() === "") {
            $.alert("강좌 종료 분을 입력해주세요.");
            return false;
        }
        return true;
    },
    userSearchModal: () => {
        let currentAuthorType = userSearchObj[vm.userSearchModalType].authorType;

        vm.userListFilteredByAuthor = vm.totalUserList.filter(user => user.userAuthor === currentAuthorType);
        vm.userList = vm.userListFilteredByAuthor;
    },
    makeProfessorUserTag() {
        $(".deleteProfessorUser").parent().remove();
        for (let i = 0; i < vm.userList.length; i++) {
            if (vm.lctreData.profsrUserSeq === vm.userList[i].userSeq) {
                let userInfoTag = "<div>" + vm.userList[i].userEmail + "&nbsp;&nbsp;&nbsp;" + vm.userList[i].userNm + "<button class='deleteProfessorUser deleteKeyword' type='button'><img src='/image/close.png' class='delete-keyword-btn'/></button></div>";
                $("#professorUserContainer").append(userInfoTag);
                break;
            }
        }
    },
    makeSmtmIntrprUserTag() {
        for (let i = 0; i < vm.userList.length; i++) {
            if (vm.lctreData.smtmIntrprSeq === vm.userList[i].userSeq) {
                let userInfoTag = "<div>" + vm.userList[i].userNm + "&nbsp;&nbsp;&nbsp;" + vm.userList[i].userEmail + "<button class='deleteSmtmIntrprUser deleteKeyword' type='button'><img src='/image/close.png' class='delete-keyword-btn'/></button></div>";
                $("#smtmIntrprContainer").append(userInfoTag);
                break;
            }
        }
    },
    userSearchModalDefault() {
        vm.userListFilteredByAuthor = vm.totalUserList;
        vm.userList = vm.userListFilteredByAuthor;
    },
    userSearchModalSet() {
        $.sendAjax({
            url: "/user/userInfoList.api",
            data: {},
            contentType: "application/json",
            success: (res) => {
                vm.totalUserList = res.data;
                vm.userList = vm.totalUserList;
                event.makeProfessorUserTag();
                event.makeSmtmIntrprUserTag();
            },
            error: function (e) {
                $.alert(e.responseJSON.message);
            },
        });
    },
}

$(document).ready(() => {
    vueInit();
    event.userSearchModalSet();
    event.init();
    vm.selectCmmnCode();
    event.getLectureDetail();
    datepicker();
    //datepicker달력에 화면 깨지는 것 설정 변경
    $.datepicker.setDefaults({
        changeMonth: false,
        changeYear: false,
    });
});
