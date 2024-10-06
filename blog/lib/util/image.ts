// utils/getRandomImage.js
export const dynamic = 'force-static'
export async function getRandomImage() {
    const response = await fetch('https://www.loliapi.com/acg/?type=url',{ cache: 'no-store' });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const imageUrl = await response.text(); // 解析 JSON 数据
    console.log(imageUrl); // 打印解析后的 JSON 数据
    return imageUrl; // 返回解析后的 JSON 数据
}