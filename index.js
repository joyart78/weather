const API_KEY = "14406322760c06e6052a588d3322c52c"
const USER_ID = '75hyzgi5imxqNRMLnH04tJqK5RcNC2sCgCgyuXGw6l8'

const startInput = document.querySelector('.modal__input')
const startBtn = document.querySelector('.modal__btn')
const input = document.querySelector('.search_input')
const searchBtn = document.querySelector('.input_btn')
const getDate = {
    0: 'Воскресенье',
    1: 'Понедельник',
    2: 'Вторник',
    3: 'Среда',
    4: 'Четверг',
    5: 'Пятница',
    6: 'Суббота',
}
const getImg = {
    '01d' : './images/CLEAR.svg',
    '01n' : './images/CLEAR0.svg',
    '02d' : './images/PCLOUDY.svg',
    '02n' : './images/PCLOUDY0.svg',
    '03d' : './images/MCLOUDY.svg',
    '03n' : './images/MCLOUDY0.svg',
    '04d' : './images/MCLOUDY.svg',
    '04n' : './images/MCLOUDY0.svg',
    '09d' : './images/HAIL.svg',
    '09n' : './images/HAIL0.svg',
    '10d' : './images/RAIN.svg',
    '10n' : './images/RAIN0.svg',
    '11d' : './images/TSTORM.svg',
    '11n' : './images/TSTORM0.svg',
    '13d' : './images/SNOW.svg',
    '13n' : './images/SNOW0.svg',
    '50d' : './images/FOG.svg',
    '50n' : './images/FOG0.svg',
}

async function checkWeather(city){
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)

        if(response.status === 200){
            const data = await response.json()
            if (localStorage.length){
                window.localStorage.removeItem(localStorage.key(0))
            }
            window.localStorage.setItem(data.name,data.name)
            const date = new Date(data.dt * 1000);
            const sunrise = new Date(data.sys.sunrise * 1000);
            const sunset = new Date(data.sys.sunset * 1000);
            const minute = date.getMinutes() < 10 ? '0' : '';
            const minute_sunrise = sunrise.getMinutes() < 10 ? '0' : '';
            const minute_sunset = sunset.getMinutes() < 10 ? '0' : '';

            document.querySelector('.weather_img').src = getImg[data.weather[0].icon]
            document.querySelector('.city').innerHTML = data.name;
            document.querySelector('.degrees_data').innerHTML = Math.round(data.main.temp) + '<span class="degrees">°C</span>' ;
            document.querySelector('.today_current_day').innerHTML = getDate[date.getDay()] + ', ';
            document.querySelector('.today_current_time').innerHTML = date.getHours() + ':' + minute + date.getMinutes();
            document.querySelector('.weather_description').innerHTML = data.weather[0].description
            document.querySelector('.max_temp_card').innerHTML = Math.round(data.main.temp_max) + '° max'
            document.querySelector('.min_temp_card').innerHTML = Math.round(data.main.temp_min) + '° min'
            document.querySelector('.wind').innerHTML = data.wind.speed + '<span class="min_temp_card">km/h</span>'
            document.querySelector('.sunrise').innerHTML = sunrise.getHours() + ':' + minute_sunrise + sunrise.getMinutes();
            document.querySelector('.sunset').innerHTML = sunset.getHours() + ':' + minute_sunset + sunset.getMinutes();
            document.querySelector('.humidity').innerHTML = data.main.humidity + '%'
            document.querySelector('.visibility').innerHTML = data.visibility / 1000 + ' km'
            document.querySelector('.pressure').innerHTML = data.main.pressure + '<span class="min_temp_card">hPa</span>'

            let photo = await getPhotos(data)

            if (photo){
                document.querySelector('.today_city').style.backgroundImage = `url('${photo}')`
            }

            async function fiveDayWeather(){
                try {
                    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`)
                    let data = await response.json()
                    let days = Object.values(data.list).slice(1,7)
                    document.querySelector('.weather_time').innerHTML = ''
                    days.forEach( daysKey =>  {
                        const date = new Date(daysKey.dt * 1000)
                        const img = getImg[daysKey.weather[0].icon];
                        document.querySelector('.weather_time').innerHTML +=
                            `<article class="weather_card">
                                <div>
                                    <span class="card_time">${date.getHours()}:00<className>
                                </div>
                                <div>
                                    <img src=${img} class="card_icon">
                                </div>
                                <div>
                                    <span class="card_degrees">${Math.round(daysKey.main.temp)}°</span>
                                </div>
                        </article>`
                    })
                }catch (err) {
                    throw new Error(err)
                }
            }

            fiveDayWeather()
            input.value = ''
        } else if (response.status === 404){
            console.log('город не найден')
            showError();
            input.value = ''
        }

    }catch (err) {
        throw new Error(err)
    }
}

async function startCheckWeather(city){
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ru`)
        if(response.status === 200){
            showHidden()
            await checkWeather(city)
        } else if (response.status === 404){
            console.log('город не найден')
            showError();
            startInput.value = ''
        }
    }catch (err) {
        throw new Error(err)
    }
}

startBtn.addEventListener('click', () => {
    if (startInput.value){
        startCheckWeather(startInput.value)
    }
})
searchBtn.addEventListener('click', () => {
    if (input.value) {
        checkWeather(input.value)
    }
})

const getPhotos = async (weather) => {
    try {
        const response = await fetch(`https://api.unsplash.com/photos/random/?client_id=${USER_ID}&count=1&query=${weather.name}, city, ${weather.weather.main}`)
        const data = await response.json()
        if (response.status === 200 && data.length){
            const urlPhoto = data[0].urls.small
            return urlPhoto
        }
    } catch (err){
        throw new Error(err)
    }
}

function showHidden()   {
    const hiden = document.querySelectorAll('.hidden')
    const start = document.querySelector('.modal_search')

    start.classList.add('hidden')
    hiden.forEach(item => item.classList.remove('hidden'))
}

function showError() {
    const errorMessage = document.querySelector('.error-message');
    errorMessage.classList.add('show');

    setTimeout(() => {
        errorMessage.classList.remove('show');
    }, 4000);
}

if (localStorage.length){
    showHidden()
    checkWeather(localStorage.key(0))
} else {
    document.querySelector('.hidden').classList.add('hidden')
    document.querySelector('.hidden_modal').classList.remove('hidden_modal')
}




