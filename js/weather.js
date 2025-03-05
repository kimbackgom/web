// 일출일몰 http://apis.data.go.kr/B090041/openapi/service/RiseSetInfoService/getAreaRiseSetInfo?ServiceKey=lo3cPvLE81qm7JGSfWL83ZxVwf28c2qFaYHa0H%2BZnZdmeIi%2Fh39bkQKOK5UV5DJbrV8uJ82kvwZtqQe9PW3%2BPw%3D%3D&dataType=JSON&locdate=20250228&location=서울

// 초단기실황 https://apihub.kma.go.kr/api/typ02/openApi/VilageFcstInfoService_2.0/getUltraSrtNcst?authKey=gtn7msayS7OZ-5rGssuzXw&numOfRows=1000&base_date=20250228&base_time=1235&dataType=JSON&nx=62&ny=126

//초단기예보 https://apihub.kma.go.kr/api/typ02/openApi/VilageFcstInfoService_2.0/getVilageFcst?authKey=gtn7msayS7OZ-5rGssuzXw&numOfRows=1000&base_date=20250228&base_time=1110&dataType=JSON&nx=62&ny=126

document.querySelectorAll(".btn").forEach(btn => {
    btn.addEventListener("click", function() {
        // 모든 버튼에서 "on" 클래스 제거
        document.querySelectorAll(".btn").forEach(b => b.classList.remove("on"));

        // 클릭된 버튼에 "on" 클래스 추가
        this.classList.add("on");

        // 클릭된 버튼의 data-dong 값 가져오기
        const localNum = this.getAttribute("data-num");
        document.querySelector(".loading").style.display = "block";
        if(localNum == 1){
          weekWeatherData(61,125);
        }else if(localNum == 2){
          weekWeatherData(61,126);
        }else{
          weekWeatherData(62,125);
        }
        
    });
});
let myChart = null; 
let tempData =[];
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, "0");
const day = String(now.getDate()).padStart(2, "0");
const hours = String(now.getHours()).padStart(2, "0");
const minutes = String(now.getMinutes()).padStart(2, "0");
const seconds = String(now.getSeconds()).padStart(2, "0");


// console.log(`${year}${month}${day} ${hours}:${minutes}`);
//초단기예보
const currentHour = hours;

// 기준 시간 배열
const timeList = [02, 05, 08, 11, 14, 17, 20, 23];

// 현재 시간보다 작은 값 중에서 가장 큰 값 찾기
const time = currentHour <= 1 ? 23 : timeList.reduce((prev, time) => (time <= currentHour ? time : prev), 2);
const baseDay = currentHour <= 1 ? String(now.getDate()-1).padStart(2, "0") : day;
const previousTime = String(time).padStart(2, "0");

// console.log(baseDay,previousTime);
// 일출일몰실황
const url = `https://apis.data.go.kr/B090041/openapi/service/RiseSetInfoService/getAreaRiseSetInfo?ServiceKey=lo3cPvLE81qm7JGSfWL83ZxVwf28c2qFaYHa0H%2BZnZdmeIi%2Fh39bkQKOK5UV5DJbrV8uJ82kvwZtqQe9PW3%2BPw%3D%3D&dataType=JSON&locdate=${year}${month}${day}&location=서울`;
console.log(url)
// API 요청 및 XML 데이터 처리
async function sunData() {
  const requestUrl = url;
  
  try {
    const response = await fetch(requestUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP 오류! 상태 코드: ${response.status}`);
    }
    
    const xmlText = await response.text(); // XML을 텍스트로 가져오기
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml"); 

    function formatTime(time) {
      const h = time.slice(0, 2);  // 첫 2자리: 시간
      const m = time.slice(2, 4);  // 마지막 2자리: 분
      return `${h}:${m}`;
    }
    const sunrise = xmlDoc.querySelector("sunrise")?.textContent;
    const sunset = xmlDoc.querySelector("sunset")?.textContent;
    document.getElementById("sunrise").innerHTML = formatTime(sunrise);
    document.getElementById("sunset").innerHTML = formatTime(sunset);
    // console.log("일출 시간:", sunrise);
    // console.log("일몰 시간:", sunset);

  } catch (error) {
    console.error("API 요청 중 오류 발생:", error,url);
  }
}

// 초단기실황

async function liveWeatherData(x,y) {
  const requestUrl = `http://apihub.kma.go.kr/api/typ02/openApi/VilageFcstInfoService_2.0/getUltraSrtNcst?authKey=gtn7msayS7OZ-5rGssuzXw&numOfRows=1000&base_date=${year}${month}${baseDay}&base_time=${currentHour}00&dataType=JSON&nx=${x}&ny=${y}`;
  
  try {
    const response = await fetch(requestUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP 오류! 상태 코드: ${response.status}`);
    }
    
    const data = await response.json(); 
    // T1H - 온도 
    document.getElementById("temp").innerHTML = data.response.body.items.item[3].obsrValue;
    // console.log("기온",data.response.body.items.item[3].obsrValue); 
  
  } catch (error) {
    console.error("API 요청 중 오류 발생:", error,requestUrl);
  }
}





async function weekWeatherData(x,y) {
    const API_URL = `https://apihub.kma.go.kr/api/typ02/openApi/VilageFcstInfoService_2.0/getVilageFcst?authKey=gtn7msayS7OZ-5rGssuzXw&numOfRows=1000&base_date=${year}${month}${baseDay}&base_time=${previousTime}00&dataType=JSON&nx=${x}&ny=${y}`;

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (!data.response || !data.response.body || !data.response.body.items) {
            throw new Error("Invalid API response format");
        }

        const items = data.response.body.items.item;

        // 오늘 날짜 구하기 (YYYYMMDD)
        const today = new Date();
        const todayStr = today.toISOString().split("T")[0].replace(/-/g, "");

        // 내일 날짜 구하기 (YYYYMMDD)
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split("T")[0].replace(/-/g, "");

        // 현재 시간 (HHMM)
        const currentHour = String(today.getHours()).padStart(2, "0") + "00";

        // 데이터를 category별로 그룹화
        const groupedData = items.reduce((acc, item) => {
            if (!acc[item.category]) {
                acc[item.category] = [];
            }
            //  console.log( item.fcstTime, currentHour)
            if(Number(item.fcstTime) >= Number(currentHour)){
              acc[item.category].push(item);
            }
            
            return acc;
        }, {});

        // 각 category에서 오늘 날짜 & 현재 시간 이후의 데이터 정렬 후 12개 선택
        const filteredData = Object.keys(groupedData).map(category => {
            const relevantData = groupedData[category]
                .filter(item => 
                    (item.fcstDate === todayStr && item.fcstTime >= currentHour) || 
                    item.fcstDate === tomorrowStr // 내일 데이터도 포함
                )
                .sort((a, b) => (a.fcstDate + a.fcstTime).localeCompare(b.fcstDate + b.fcstTime)) // 날짜 & 시간 정렬
                .slice(0, 12); // 12개 선택

            return {
                category,
                values: relevantData
            };
        });
        // console.log(filteredData,filteredData[0]);
        // 그래프 시간
        document.querySelectorAll(".graph-time li").forEach((el,i) => {
          //  console.log(el,i )
          el.innerHTML = `<span>${filteredData[0].values[i].fcstTime.slice(0, 2)}<span>시`;
        });
        // 테이블 시간
        document.querySelectorAll(".table-time td").forEach((el,i) => {
          //  console.log(el,i )
          el.innerHTML = `${filteredData[0].values[i].fcstTime.slice(0, 2)}시`;
        });
        // 기온
        document.querySelectorAll(".table-temp td").forEach((el,i) => {
          //  console.log(el,i )
          el.innerHTML = `${filteredData[0].values[i].fcstValue}<small>℃</small>`;
          tempData.push(filteredData[0].values[i].fcstValue);
        });
        //습도
         document.querySelectorAll(".table-REH td").forEach((el,i) => {
          //  console.log(el,i )
          el.innerHTML = `${filteredData[10].values[i].fcstValue}<small>%</small>`;
        });
         //강수확률
         document.querySelectorAll(".table-POP td").forEach((el,i) => {
          //  console.log(el,i )
          el.innerHTML = `${filteredData[7].values[i].fcstValue}<small>%</small>`;
        });
        //풍량
         document.querySelectorAll(".table-WSD td").forEach((el,i) => {
          //  console.log(el,i )
          el.innerHTML = `${filteredData[4].values[i].fcstValue}<small>m/s</small>`;
        });
        //강수량
         document.querySelectorAll(".table-PCP td").forEach((el,i) => {
          //  console.log(el,i )
          const text = filteredData[9].values[i].fcstValue == "강수없음" ? "-" :  `${filteredData[9].values[i].fcstValue}<small>mm</small>`;
          el.innerHTML = text;
        });
        //적설량
         document.querySelectorAll(".table-SNO td").forEach((el,i) => {
         const text = filteredData[11].values[i].fcstValue == "적설없음" ? "-" :  `${filteredData[9].values[i].fcstValue}<small>cm</small>`;
          el.innerHTML = text;
        });
        document.querySelectorAll(".table-PTY td").forEach((el,i) => {
        //  SKY 맑음(1), 구름많음(3), 흐림(4)  filteredData[5].values[i].fcstValue
        // PTY  없음(0), 비(1), 비/눈(2), 눈(3), 소나기(4)  filteredData[6].values[i].fcstValue
        const pty = filteredData[6].values[i].fcstValue;
        const sky = filteredData[5].values[i].fcstValue;
          if(pty == 0){
            if(sky == 1){
               smallicon = "src='./images/icons_sm_sun.png'";
               bigicon = "./images/icons_sun.png";
               text = "맑음";
               bg = "./images/bg_sunny.png";
              
            }else if(sky == 3){
               smallicon = "src='./images/icons_sm_sun_cloud.png'";
               bigicon = "./images/icons_sun_cloud.png";
               text = "구름많음";
                bg = "./images/bg_clouds.png";

            }else if(sky == 4){
               smallicon = "src='./images/icons_sm_clouds.png'";
               bigicon = "./images/icons_clouds.png";
               text = "흐림";
               bg = "./images/bg_clouds.png";

            }
          }else if(pty == 1){
             smallicon = "src='./images/icons_sm_rain.png'";
             bigicon = "./images/icons_rain.png";
             text = "비";
             bg = "./images/bg_rain.png";

          }else if(pty == 2){
             smallicon = "src='./images/icons_sm_snow3.png'";
             bigicon = "./images/icons_snow3.png";
             text = "비";
             bg = "./images/bg_rain.png";

          }else if(pty == 3){
             smallicon = "src='./images/icons_sm_snow.png'";
             bigicon = "./images/icons_snow.png";
             text = "눈";
             bg = "./images/bg_snow.png";

          }else if(pty == 4){
             smallicon = "src='./images/icons_sm_sun_rain.png'";
             bigicon = "./images/icons_sun_rain.png";
             text = "소나기";
             bg = "./images/bg_rain.png";
          }
        
         el.innerHTML = `<img ${smallicon}>`;
         if(i == 0){
          document.getElementById("icon").src = bigicon;
          document.getElementById("text").innerHTML = text;
          document.getElementById("body").style.backgroundImage =`url('${bg}')`;
         }
        });
         chartFunc(tempData);
         sunData();
        // 초단기실황 
        liveWeatherData(x,y);
        console.log()
        document.querySelector(".loading").style.display = "none";
       
    } catch (error) {
        console.error("Error fetching weather data:", error,API_URL);
    }
}


//일출일몰 

//초단기예보
weekWeatherData(61,125);
function chartFunc (tempData){
  // console.log(tempData)
    var ctx = document.getElementById('graph').getContext("2d");
      // 기존 차트가 있으면 삭제
     if (myChart && typeof myChart.destroy === "function") {
        myChart.destroy();
    }
    var gradientStroke = ctx.createLinearGradient(200, 0, 100, 0);
    gradientStroke.addColorStop(0, '#fff');
    gradientStroke.addColorStop(1, '#fff'); 
    
    // var tempData = [-3, 2, 2, 1, -1, -2, 0, 3, 5, 1, -2, -3];
    var gradientFill = ctx.createLinearGradient(0,50, 0, 150);
    gradientFill.addColorStop(0, "rgba(0, 0, 0, 0)");
    gradientFill.addColorStop(1, "rgba(0, 0, 0, 0)");
    Chart_config = {
      plugins:[ChartDataLabels],
      responsive: true,
      type: 'line', 
      data: {
        labels: ["", "", "", "", "", "", "", "", "", "", "", ""],
        datasets: [{
          label: "Data",
          borderColor: "rgba(255, 255, 255 , 1)",
          pointBorderColor: gradientStroke,
          pointBackgroundColor: gradientStroke,
          pointHoverBackgroundColor: gradientStroke,
          pointHoverBorderColor: gradientStroke,
          pointBorderWidth: 5,
          pointHoverRadius: 10,
          pointHoverBorderWidth: 1,
          pointRadius: 3,
          fill: true,
          backgroundColor: gradientFill,
          borderWidth:2,
          data: tempData,
          datalabels: {
            labels: {
                value: {
                    align: 'top',
                    borderWidth: 3,   
                    borderRadius: 4,
                    padding: 4
                }
            }
        }
        }]
      },
      options: {
        layout: {
          padding:{
            top:50,
            left:30,
            right:40,
            
          }
        },
        plugins:{
           legend: {
            display:false,
           },
          datalabels:{
            color: '#ffffff',
            font: {size:21},
            formatter:function(value,context){
              var idx = context.dataIndex;
              return value +'℃'
            }
          },
          tooltip: {
            enabled: false // <-- this option disables tooltips
          }
        },
        
        hover: {mode: null},
        showTooltips: false,
        maintainAspectRatio: false,
        responsive: true,
        legend: {
          position: "bottom"
        },
        scales: {
          xAxes: {
            grid: {
              display: false, 
              drawBorder: false,
             
            },
             
          },
          yAxes: {
            ticks: {
              autoSkip: true,
              labelOffset: 0,
              padding: 0,
              font: {
                size: 0,
              },
            },
            grid: {
              display: false, 
              drawBorder: false,
            },
          },
          
         
          
        }
      }
    }
     myChart = new Chart(ctx, Chart_config,tempData);
}
