const puppeteer = require('puppeteer');
const ExcelJS = require('exceljs');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // List of category URLs to scrape
    const categories = [
        'https://padiumkm.id/c/bahan-kimia',
        'https://padiumkm.id/c/buku',
        'https://padiumkm.id/c/barang-lainnya',
        'https://padiumkm.id/c/dapur',
        'https://padiumkm.id/c/elektronik',
        'https://padiumkm.id/c/fashion',
        'https://padiumkm.id/c/fashion-anak-and-bayi',
        'https://padiumkm.id/c/fashion-muslim',
        'https://padiumkm.id/c/fashion-pria',
        'https://padiumkm.id/c/fashion-wanita',
        'https://padiumkm.id/c/film-and-musik',
        'https://padiumkm.id/c/gaming',
        'https://padiumkm.id/c/handphone-and-tablet',
        'https://padiumkm.id/c/ibu-and-bayi',
        'https://padiumkm.id/c/jasa-advertising',
        'https://padiumkm.id/c/jasa-ekspedisi-and-pengepakan',
        'https://padiumkm.id/c/jasa-event-organizer',
        'https://padiumkm.id/c/jasa-konstruksi-and-renovasi',
        'https://padiumkm.id/c/jasa-konsultan-and-penilaian',
        'https://padiumkm.id/c/jasa-lainnya',
        'https://padiumkm.id/c/jasa-mandor-and-tenaga-kerja-lainnya',
        'https://padiumkm.id/c/jasa-perawatan-elektronik-and-it',
        'https://padiumkm.id/c/jasa-perawatan-gedung',
        'https://padiumkm.id/c/jasa-perawatan-kendaraan',
        'https://padiumkm.id/c/jasa-perawatan-peralatan-and-mesin',
        'https://padiumkm.id/c/jasa-percetakan-and-media',
        'https://padiumkm.id/c/jasa-travel-and-akomodasi',
        'https://padiumkm.id/c/kamera',
        'https://padiumkm.id/c/kecantikan',
        'https://padiumkm.id/c/kesehatan',
        'https://padiumkm.id/c/komputer-and-laptop',
        'https://padiumkm.id/c/konveksi-and-laundry',
        'https://padiumkm.id/c/mainan-and-hobi',
        'https://padiumkm.id/c/makanan-and-minuman',
        'https://padiumkm.id/c/office-and-stationery',
        'https://padiumkm.id/c/olahraga',
        'https://padiumkm.id/c/otomotif',
        'https://padiumkm.id/c/pendidikan-dan-pelatihan',
        'https://padiumkm.id/c/pengadaan-and-sewa-kendaraan',
        'https://padiumkm.id/c/pengadaan-peralatan-mesin',
        'https://padiumkm.id/c/perawatan-hewan',
        'https://padiumkm.id/c/perawatan-hewan-peliharaan',
        'https://padiumkm.id/c/perawatan-tubuh',
        'https://padiumkm.id/c/perlengkapan-pesta-and-craft',
        'https://padiumkm.id/c/pertanian-and-peternakan',
        'https://padiumkm.id/c/pertukangan',
        'https://padiumkm.id/c/properti',
        'https://padiumkm.id/c/rumah-tangga',
        'https://padiumkm.id/c/sewa-gedung',
        'https://padiumkm.id/c/sewa-kendaraan',
        'https://padiumkm.id/c/sewa-peralatan-mesin',
        'https://padiumkm.id/c/souvenir-and-merchandise',
        'https://padiumkm.id/c/tour-and-travel',
        'https://padiumkm.id/c/wedding'
    ];

    // Create a new Excel workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Products');

    // Add columns to the worksheet
    worksheet.columns = [
        { header: 'Name', key: 'name', width: 30 },
        { header: 'Price', key: 'price', width: 15 },
        { header: 'Discount', key: 'discount', width: 15 },
        { header: 'Category', key: 'category', width: 30 },
        { header: 'Brand', key: 'brand', width: 15 },
        { header: 'Min Purchase', key: 'minPurchase', width: 15 },
        { header: 'Unit Weight', key: 'unitWeight', width: 15 },
        { header: 'Size Dimensions', key: 'sizeDimensions', width: 30 },
        { header: 'Seller', key: 'seller', width: 30 },
        { header: 'Ratings', key: 'ratings', width: 10 },
    ];

    for (const categoryUrl of categories) {
        await page.goto(categoryUrl, { waitUntil: 'networkidle2' });

        let hasNextPage = true;

        while (hasNextPage) {
            // Wait for the product container to be visible
            await page.waitForSelector('#__next > div.bg-white > div:nth-child(2) > div > div.bg-white.w-full.flex.flex-col.md\\:flex-row.space-y-6.md\\:space-y-0.space-x-0.md\\:space-x-\\[24px\\] > main > div:nth-child(2) > div:nth-child(2) > div > div');

            const productSelectors = '#__next > div.bg-white > div:nth-child(2) > div > div.bg-white.w-full.flex.flex-col.md\\:flex-row.space-y-6.md\\:space-y-0.space-x-0.md\\:space-x-\\[24px\\] > main > div:nth-child(2) > div:nth-child(2) > div > div > div';
            const productCount = await page.$$eval(productSelectors, products => products.length);

            for (let i = 0; i < productCount; i++) {
                const product = await page.$(`${productSelectors}:nth-child(${i + 1})`);

                if (product) {
                    await product.click();
                    await new Promise(resolve => setTimeout(resolve, 2000));

                    await page.waitForSelector('#product-descriptions > div.pb-4.px-0.xl\\:pb-6.pt-4.md\\:pt-0 > h1');

                    const productData = await page.evaluate(() => {
                        const name = document.querySelector("#product-descriptions > div.pb-4.px-0.xl\\:pb-6.pt-4.md\\:pt-0 > h1")?.innerText || 'No name found';
                        const price = document.querySelector("#product-descriptions > div.pb-4.px-0.xl\\:pb-6.pt-4.md\\:pt-0 > label")?.innerText || 'No price found';
                        const discount = document.querySelector("#product-descriptions > div.pb-4.px-0.xl\\:pb-6.pt-4.md\\:pt-0 > div.flex.items-center.mt-1 > div.bg-\\[\\#FDE5E4\\].text-\\[10px\\].flex.items-center.justify-center.px-1.w-fit.rounded-\\[4px\\].h-\\[18px\\].px-1\\.5.\\!h-\\[24px\\].\\!text-\\[12px\\].leading-\\[18px\\] > div > span")?.innerText || 'No discount found';

                        const category = document.querySelector("#product-descriptions > div.space-y-10.pt-4.pb-4.mx-0.text-paletteText-primary.font-ubuntu > div > table > tbody > tr:nth-child(1) > td.w-full.xl\\:w-\\[65\\%\\].py-1\\.5.align-top > div")?.innerText || 'No category found';
                        const brand = document.querySelector("#product-descriptions > div.space-y-10.pt-4.pb-4.mx-0.text-paletteText-primary.font-ubuntu > div > table > tbody > tr:nth-child(2) > td.w-full.xl\\:w-\\[65\\%\\].py-1\\.5.align-top > div")?.innerText || 'No brand found';
                        const minPurchase = document.querySelector("#product-descriptions > div.space-y-10.pt-4.pb-4.mx-0.text-paletteText-primary.font-ubuntu > div > table > tbody > tr:nth-child(3) > td.w-full.xl\\:w-\\[65\\%\\].py-1\\.5.align-top > div")?.innerText || 'No min purchase found';
                        const unitWeight = document.querySelector("#product-descriptions > div.space-y-10.pt-4.pb-4.mx-0.text-paletteText-primary.font-ubuntu > div > table > tbody > tr:nth-child(4) > td.w-full.xl\\:w-\\[65\\%\\].py-1\\.5.align-top > div")?.innerText || 'No unit weight found';
                        const sizeDimensions = document.querySelector("#product-descriptions > div.space-y-10.pt-4.pb-4.mx-0.text-paletteText-primary.font-ubuntu > div > table > tbody > tr:nth-child(5) > td.w-full.xl\\:w-\\[65\\%\\].py-1\\.5.align-top > div")?.innerText || 'No size dimensions found';
                        const seller = document.querySelector("#seller-information-container > div:nth-child(1) > div > div.flex-1.flex-col > a > span")?.innerText || 'No seller found';
                        const ratings = document.querySelector("#seller-information-container > div.w-full.lg\\:w-fit > div > div > div > div > div.flex.items-center.justify-center.text-sm.font-medium.flex-nowrap.text-paletteText-primary.h-\\[24px\\] > span")?.innerText || 'No ratings found';

                        return {
                            name,
                            price,
                            discount,
                            category,
                            brand,
                            minPurchase,
                            unitWeight,
                            sizeDimensions,
                            seller,
                            ratings
                        };
                    });

                    // Add the product data as a new row in the worksheet
                    worksheet.addRow(productData);

                    await page.goBack({ waitUntil: 'networkidle2' });
                    await new Promise(resolve => setTimeout(resolve, 2000));
                } else {
                    console.log(`Product at index ${i} is no longer available.`);
                }
            }

            // Check if the "Next" button exists and is enabled, otherwise stop the loop
            const nextButton = await page.$('selector_for_next_button'); // Replace with actual selector
            if (nextButton) {
                await nextButton.click();
                await page.waitForNavigation({ waitUntil: 'networkidle2' });
            } else {
                hasNextPage = false;
            }
        }
    }

    // Save the workbook to a file
    await workbook.xlsx.writeFile('products.xlsx');

    console.log('Excel file created successfully!');

    await browser.close();
})();
