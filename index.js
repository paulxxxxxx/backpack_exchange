"use strict";
// 使用严格模式来避免潜在的错误

Object.defineProperty(exports, "__esModule", { value: true });
// 定义模块导出，确保ES模块兼容性

const backpack_client_1 = require("./backpack_client");
// 导入backpack_client模块，用于执行交易所的API调用

function delay(ms) {
    // 定义一个延时函数，用于在操作之间添加延迟
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

function getNowFormatDate() {
    // 获取当前日期和时间的函数，格式化为年-月-日 时:分:秒
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    // 定义日期和时间的分隔符

    // 获取日期组件，并确保单数字部分前面加0
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var strHour = date.getHours();
    var strMinute = date.getMinutes();
    var strSecond = date.getSeconds();
    // 使用三元运算符简化这部分也是可以的，例如 month = month < 10 ? `0${month}` : month;

    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + strHour + seperator2 + strMinute
        + seperator2 + strSecond;
    // 拼接最终的日期时间字符串

    return currentdate;
}

let successbuy = 0;
let sellbuy = 0;
// 定义两个变量用于跟踪买卖成功的次数

const init = async (client) => {
    // 初始化函数，用于启动交易流程
    try {
        console.log(`成功买入次数:${successbuy},成功卖出次数:${sellbuy}`);
        console.log(getNowFormatDate(), "等待3秒...");
        await delay(3000); // 在每次操作之前等待3秒

        console.log(getNowFormatDate(), "正在获取账户信息中...");
        let userbalance = await client.Balance();
        // 获取账户余额信息

        if (userbalance.USDC.available > 5) {
            // 如果USDC余额大于5，则尝试执行买入操作
            await buyfun(client);
        } else {
            // 否则，尝试执行卖出操作
            await sellfun(client);
            return;
        }
    } catch (e) {
        // 如果在交易过程中遇到任何错误，重新启动交易流程
        init(client);
        console.log(getNowFormatDate(), "挂单失败，重新挂单中...");
        await delay(1000); // 在重新尝试之前等待1秒
    }
}

const sellfun = async (client) => {
    // 取消所有未完成的卖单
    let GetOpenOrders = await client.GetOpenOrders({ symbol: "SOL_USDC" });
    // 调用API获取当前所有打开的订单，这里以SOL/USDC交易对为例

    if (GetOpenOrders.length > 0) {
        // 如果存在未完成的订单，则取消这些订单
        let CancelOpenOrders = await client.CancelOpenOrders({ symbol: "SOL_USDC" });
        // 调用API取消所有SOL/USDC的订单
        console.log(getNowFormatDate(), "取消了所有挂单");
        // 记录取消订单的操作
    } else {
        console.log(getNowFormatDate(), "账号订单正常，无需取消挂单");
        // 如果没有未完成的订单，则不需要取消操作
    }

    console.log(getNowFormatDate(), "正在获取账户信息中...");
    // 获取账户信息
    let userbalance2 = await client.Balance();
    // 调用API获取当前账户的余额信息
    console.log(getNowFormatDate(), "账户信息:", userbalance2);
    // 打印账户余额信息

    console.log(getNowFormatDate(), "正在获取sol_usdc的市场当前价格中...");
    // 获取SOL/USDC的当前市场价格
    let { lastPrice: lastPriceask } = await client.Ticker({ symbol: "SOL_USDC" });
    // 调用API获取SOL/USDC的最后成交价
    console.log(getNowFormatDate(), "sol_usdc的市场当前价格:", lastPriceask);
    // 打印当前市场价格

    let quantitys = ((userbalance2.SOL.available / 2) - 0.02).toFixed(2).toString();
    // 计算卖出数量，这里示例中卖出可用SOL的一半减去固定数量（0.02个），并将结果格式化为字符串
    console.log(getNowFormatDate(), `正在卖出中... 卖${quantitys}个SOL`);
    // 记录卖出操作

    let orderResultAsk = await client.ExecuteOrder({
        orderType: "Limit",
        price: lastPriceask.toString(),
        // 以当前市场价格作为卖出价格
        quantity: quantitys,
        // 设置卖出数量
        side: "Ask",
        // 指定操作类型为卖出（Ask）
        symbol: "SOL_USDC",
        // 指定交易对
        timeInForce: "IOC"
        // 设置订单时效为立即成交或取消（IOC）
    });

    if (orderResultAsk?.status == "Filled" && orderResultAsk?.side == "Ask") {
        // 如果订单被完全成交
        console.log(getNowFormatDate(), "卖出成功");
        // 记录卖出成功
        sellbuy += 1;
        // 成功卖出次数加一
        console.log(getNowFormatDate(), "订单详情:", `卖出价格:${orderResultAsk.price}, 卖出数量:${orderResultAsk.quantity}, 订单号:${orderResultAsk.id}`);
        // 打印订单详情
        init(client);
        // 重新启动交易流程
    } else {
        console.log(getNowFormatDate(), "卖出失败");
        // 如果订单没有被完全成交，记录卖出失败
        throw new Error("卖出失败");
        // 抛出错误，触发异常处理逻辑
    }
};
const buyfun = async (client) => {
    // 取消所有未完成的买单
    let GetOpenOrders = await client.GetOpenOrders({ symbol: "SOL_USDC" });
    // 调用API获取当前所有打开的订单，这里以SOL/USDC交易对为例

    if (GetOpenOrders.length > 0) {
        // 如果存在未完成的订单，则取消这些订单
        let CancelOpenOrders = await client.CancelOpenOrders({ symbol: "SOL_USDC" });
        // 调用API取消所有SOL/USDC的订单
        console.log(getNowFormatDate(), "取消了所有挂单");
        // 记录取消订单的操作
    } else {
        console.log(getNowFormatDate(), "账号订单正常，无需取消挂单");
        // 如果没有未完成的订单，则不需要取消操作
    }

    console.log(getNowFormatDate(), "正在获取账户信息中...");
    // 获取账户信息
    let userbalance = await client.Balance();
    // 调用API获取当前账户的余额信息
    console.log(getNowFormatDate(), "账户信息:", userbalance);
    // 打印账户余额信息

    console.log(getNowFormatDate(), "正在获取sol_usdc的市场当前价格中...");
    // 获取SOL/USDC的当前市场价格
    let { lastPrice } = await client.Ticker({ symbol: "SOL_USDC" });
    // 调用API获取SOL/USDC的最后成交价
    console.log(getNowFormatDate(), "sol_usdc的市场当前价格:", lastPrice);
    // 打印当前市场价格

    console.log(getNowFormatDate(), `正在买入中... 花${(userbalance.USDC.available - 2).toFixed(2).toString()}个USDC买SOL`);
    // 计算买入的USDC数量，这里示例中用可用USDC余额减去固定数值（2个USDC）作为买入金额，并将结果格式化为字符串
    let quantitys = ((userbalance.USDC.available - 2) / lastPrice).toFixed(2).toString();
    // 根据买入金额和当前价格计算买入SOL的数量，并格式化为字符串
    console.log(getNowFormatDate(), `买入数量: ${quantitys}`);
    // 记录买入数量

    let orderResultBid = await client.ExecuteOrder({
        orderType: "Limit",
        price: lastPrice.toString(),
        // 以当前市场价格作为买入价格
        quantity: quantitys,
        // 设置买入数量
        side: "Bid",
        // 指定操作类型为买入（Bid）
        symbol: "SOL_USDC",
        // 指定交易对
        timeInForce: "IOC"
        // 设置订单时效为立即成交或取消（IOC）
    });

    if (orderResultBid?.status == "Filled" && orderResultBid?.side == "Bid") {
        // 如果订单被完全成交
        console.log(getNowFormatDate(), "买入成功");
        // 记录买入成功
        successbuy += 1;
        // 成功买入次数加一
        console.log(getNowFormatDate(), "订单详情:", `购买价格:${orderResultBid.price}, 购买数量:${orderResultBid.quantity}, 订单号:${orderResultBid.id}`);
        // 打印订单详情
        init(client);
        // 重新启动交易流程
    } else {
        console.log(getNowFormatDate(), "买入失败");
        // 如果订单没有被完全成交，记录买入失败
        throw new Error("买入失败");
        // 抛出错误，触发异常处理逻辑
    }
};


(async () => {
    const apisecret = "";
    const apikey = "";
    const client = new backpack_client_1.BackpackClient(apisecret, apikey);
    init(client);
})()

// 卖出
// client.ExecuteOrder({
//     orderType: "Limit",
//     price: "110.00",
//     quantity: "0.36",
//     side: "Ask", //卖
//     symbol: "SOL_USDC",
//     timeInForce: "IOC"
// }).then((result) => {
//     console.log(getNowFormatDate(),result);
// })

// 买入
// client.ExecuteOrder({
//     orderType: "Limit",
//     price: "110.00",
//     quantity: "0.36",
//     side: "Bid", //买
//     symbol: "SOL_USDC",
//     timeInForce: "IOC"
// }).then((result) => {
//     console.log(getNowFormatDate(),result);
// })
