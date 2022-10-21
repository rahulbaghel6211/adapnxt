
const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs");
const { Parser } = require('json2csv');

 const url = "https://www.quill.com/hanging-file-folders/cbk/122567.html";


let data = [];
let product_name = [];
let product_price = [];
let product_item_no = [];
let product_modal_no = [];
let product_discription = [];

axios.get(url).
    then((response) => {
       
        let cheeri= cheerio.load(response.data);
        cheeri('#ResultsSection div').each(function (el, index) {
            
            let Product_Name= cheeri(this).find('a[class="desc4 scTrack pfm sku-description"]').text().trim()
            let Product_Price = cheeri(this).find('span[class="priceupdate"]').text()
            let Product_Item_Number = cheeri(this).find('div[class="iNumber formLabel lblItemNo adptfont"]').text().trim()
            let Product_Model_Number = cheeri(this).find('div[class="model-number"]').text().trim()
            let Product_Description = cheeri(this).find('div[class="skuBrowseBullet"]').text().trim()

            if (Product_Name !== ""  && product_name[product_name.length-1] != Product_Name) {
                product_name.push(Product_Name)
            }
            if (Product_Price !== ""  && product_price[product_price.length-1] !=Product_Price) {
                product_price.push(Product_Price)
            }
            if (Product_Item_Number !== ""  && product_item_no[product_item_no.length-1] !=Product_Item_Number) {
                product_item_no.push(Product_Item_Number)
            }
            if (Product_Model_Number !== ""  && product_modal_no[product_modal_no.length-1] !=Product_Model_Number) {
                product_modal_no.push(Product_Model_Number)
            }
            if (Product_Description !== ""  && product_discription[product_discription.length-1] !=Product_Description) {
                product_discription.push(Product_Description)
            }
        });
        for (let i = 0; i <10; i++){
            data.push({
                "Product Name" : product_name[i],
                "Product Price" : product_price[i],
                "Item Number/ SKU/ Product Code" : product_item_no[i],
                "Model Number" : product_modal_no[i],
                "Product Category" : "hanging-file-folders",
                "Product Description" : product_discription[i]  
            })
        }
    
        const AllData= ['Product Name', "Product Price", "Item Number/ SKU/ Product Code", "Model Number", "Product Category", "Product Description"];
        const Find= { AllData };
        
        const parser = new Parser(Find);
        const csv = parser.parse(data);
        console.log(csv);

        fs.writeFileSync("./data.csv", csv, "utf-8");

    }).catch((err) => {
    console.log(err)
    })

 
   