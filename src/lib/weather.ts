// 天气 API 集成
// 支持多个天气服务提供商

export interface WeatherData {
    temperature: string; // 温度，如 "20°C"
    condition: string; // 天气状况，如 "晴"
    icon: string; // 天气图标代码
    updateTime: string; // 更新时间
}

export type WeatherProvider = 'qweather' | 'openweather' | 'seniverse';

// 和风天气 API
export async function getQweatherData(cityCode: string, apiKey: string): Promise<WeatherData> {
    try {
        const response = await fetch(
            `https://devapi.qweather.com/v7/weather/now?location=${cityCode}&key=${apiKey}`
        );

        if (!response.ok) {
            throw new Error(`Qweather API error: ${response.status}`);
        }

        const data = await response.json();

        if (data.code !== '200') {
            throw new Error(`Qweather API returned code: ${data.code}`);
        }

        return {
            temperature: `${data.now.temp}°C`,
            condition: data.now.text,
            icon: data.now.icon,
            updateTime: data.now.obsTime,
        };
    } catch (error) {
        console.error('Qweather API error:', error);
        throw error;
    }
}

// OpenWeather API
export async function getOpenWeatherData(cityName: string, apiKey: string): Promise<WeatherData> {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)},CN&appid=${apiKey}&units=metric&lang=zh_cn`
        );

        if (!response.ok) {
            throw new Error(`OpenWeather API error: ${response.status}`);
        }

        const data = await response.json();

        return {
            temperature: `${Math.round(data.main.temp)}°C`,
            condition: data.weather[0].description,
            icon: data.weather[0].icon,
            updateTime: new Date(data.dt * 1000).toISOString(),
        };
    } catch (error) {
        console.error('OpenWeather API error:', error);
        throw error;
    }
}

// 心知天气 API
export async function getSeniverseData(cityName: string, apiKey: string): Promise<WeatherData> {
    try {
        const response = await fetch(
            `https://api.seniverse.com/v3/weather/now.json?key=${apiKey}&location=${encodeURIComponent(cityName)}&language=zh-Hans&unit=c`
        );

        if (!response.ok) {
            throw new Error(`Seniverse API error: ${response.status}`);
        }

        const data = await response.json();
        const result = data.results[0];

        return {
            temperature: `${result.now.temperature}°C`,
            condition: result.now.text,
            icon: result.now.code,
            updateTime: result.last_update,
        };
    } catch (error) {
        console.error('Seniverse API error:', error);
        throw error;
    }
}

// 统一的天气获取接口
export async function getWeatherData(
    provider: WeatherProvider,
    cityCode: string,
    cityName: string,
    apiKey: string
): Promise<WeatherData> {
    switch (provider) {
        case 'qweather':
            return getQweatherData(cityCode, apiKey);
        case 'openweather':
            return getOpenWeatherData(cityName, apiKey);
        case 'seniverse':
            return getSeniverseData(cityName, apiKey);
        default:
            throw new Error(`Unsupported weather provider: ${provider}`);
    }
}

// 天气数据缓存
const weatherCache = new Map<string, { data: WeatherData; timestamp: number }>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 分钟

export async function getCachedWeatherData(
    provider: WeatherProvider,
    cityCode: string,
    cityName: string,
    apiKey: string
): Promise<WeatherData> {
    const cacheKey = `${provider}-${cityCode}`;
    const cached = weatherCache.get(cacheKey);

    // 检查缓存是否有效
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }

    // 获取新数据
    const data = await getWeatherData(provider, cityCode, cityName, apiKey);

    // 更新缓存
    weatherCache.set(cacheKey, {
        data,
        timestamp: Date.now(),
    });

    return data;
}

// 清除缓存
export function clearWeatherCache() {
    weatherCache.clear();
}
