let vueData = {
    firstCategoryList: [],
    firstCategoryCode: "",
    subCategoryList: [],
    subCategoryCode: "",
    userAuthor: "",
};

let vm;
let calendarEl = null;
let calendar = null;

var vueInit = () => {
    const app = Vue.createApp({
        data() {
            return vueData;
        },
        methods: {
            firstCategoryChange: () => {
                let paramMap = null;
                if (vm.firstCategoryCode === "") {
                    vm.subCategoryList = [];
                    vm.subCategoryCode = "";
                    paramMap = {};
                } else {
                    paramMap = {upperCmmnCode: vm.firstCategoryCode};
                    vm.subCategoryList = [];
                    vm.subCategoryCode = "";
                }
                $.sendAjax({
                    url: "/cmmn/selectCmmnCode.api",
                    data: paramMap,
                    contentType: "application/json",
                    success: (res) => {
                        if (vm.firstCategoryCode === "") {
                            paramMap = {};
                        } else {
                            paramMap = {'firstCategoryCode': vm.firstCategoryCode};
                            vm.subCategoryList = res.data;
                        }
                        $.sendAjax({
                            url: "/lctreController/selectUserPlanList.api",
                            data: paramMap,
                            contentType: "application/json",
                            success: (res) => {
                                calendar = new FullCalendar.Calendar(calendarEl, {
                                    headerToolbar: {
                                        left: 'prev,next today',
                                        center: 'title',
                                        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                                    },
                                    initialDate: util.date.getToday(),
                                    locale: 'ko',
                                    navLinks: true, // can click day/week names to navigate views
                                    selectable: true,
                                    selectMirror: true,
                                    // 해더에 표시할 툴바
                                    headerToolbar: {
                                        left: 'prev,next today',
                                        center: 'title',
                                        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                                    },
                                    eventClick: function (info) {
                                        event.showDetailPage(info);
                                    },
                                    editable: false,
                                    dayMaxEvents: true, // allow "more" link when too many events
                                    events: res.data,
                                });
                                calendar.render();
                            },
                            error: function (e) {
                                $.alert(e.responseJSON.message);
                            },
                        });
                    },
                    error: function (e) {
                        $.alert(e.responseJSON.message);
                    },
                });
            },
            subCategoryChange: () => {
                let paramMap
                    = {
                    firstCategoryCode: vm.firstCategoryCode,
                    kndCode: vm.subCategoryCode
                };
                $.sendAjax({
                    url: "/lctreController/selectUserPlanList.api",
                    data: paramMap,
                    contentType: "application/json",
                    success: (res) => {
                        calendar = new FullCalendar.Calendar(calendarEl, {
                            headerToolbar: {
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                            },
                            initialDate: util.date.getToday(),
                            locale: 'ko',
                            lang: 'ko',
                            navLinks: true, // can click day/week names to navigate views
                            selectable: true,
                            selectMirror: true,
                            // 해더에 표시할 툴바
                            headerToolbar: {
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                            },
                            eventClick: function (info) {
                                event.showDetailPage(info);
                            },
                            editable: false,
                            dayMaxEvents: true, // allow "more" link when too many events
                            events: res.data,
                        });
                        calendar.render();
                    },
                    error: function (e) {
                        $.alert(e.responseJSON.message);
                    },
                });
            },
        },
    })
    vm = app.mount("#content");
};

let event = {
    init: () => {
        let temp = util.getStorage("userAuthor");
        vm.userAuthor = util.getStorage("userAuthor");
        calendarEl = document.getElementById('calendar');
        calendar = new FullCalendar.Calendar(calendarEl, {});
    },
    initCalendar: () => {
        let res = $.sendAjax({
            url: "/lctreController/selectUserPlanList.api",
            data: {},
            contentType: "application/json",
        });
        res.done(function (res) {
            calendar = new FullCalendar.Calendar(calendarEl, {
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                },
                initialDate: util.date.getToday(),
                locale: 'ko',
                navLinks: true, // can click day/week names to navigate views
                selectable: true,
                selectMirror: true,
                // 해더에 표시할 툴바
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                },
                eventClick: function (info) {
                    event.showDetailPage(info);
                },
                editable: false,
                dayMaxEvents: true, // allow "more" link when too many events
                events: res.data,
            });
            calendar.render();
        });
    },
    showDetailPage: (info) => {
		console.log("🚀 ~ event.info:", info);

        let currentUrl = window.location.href;
        let adminIdx = currentUrl.indexOf("admin");
        let host= currentUrl.substring(0, adminIdx);
        let division = info.event.extendedProps.division;
        let openNewWindow = null;
        switch (division) {
            case 'lctre':
                openNewWindow = window.open("about:blank");
                // openNewWindow.location.href = host + "admin/lctreSemina/lctreDetail.html?lctreSeq=" + info.event.extendedProps.lctreSeq;
                openNewWindow.location.href = host + "admin/lctreSemina/lctreOperateDetail.html?lctreSeq=" + info.event.extendedProps.lctreSeq + "&lctreSn=" + info.event.extendedProps.lctreSn;
				// https://kongzi.sch.ac.kr/sch/admin/lctreSemina/lctreOperateDetail.html?lctreSeq=LCTRE_00000181&lctreSn=1
                break;
            case 'semina':
                openNewWindow = window.open("about:blank");
                openNewWindow.location.href = host + "admin/lctreSemina/seminaDetail.html?seminaSeq=" + info.event.extendedProps.seminaSeq;
                break;
            case 'cnslt':
                openNewWindow = window.open("about:blank");
                openNewWindow.location.href = host + "admin/cnsltExprn/consultOperateDetail.html?cnsltSeq=" + info.event.extendedProps.cnsltSeq + "&cnsltSn=" + info.event.extendedProps.cnsltSn;
                break;
            case 'exprn':
                openNewWindow = window.open("about:blank");
                openNewWindow.location.href = host + "admin/cnsltExprn/experienceOperateDetail.html?exprnSeq=" + info.event.extendedProps.exprnSeq + "&exprnSn=" + info.event.extendedProps.exprnSn;
                break;
        }
    },
};

$(document).ready(() => {
    vueInit();
    event.init();
    event.initCalendar();
});
