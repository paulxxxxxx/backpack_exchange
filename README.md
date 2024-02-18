# backpack_exchange

 要用脚本请把本文档看完
 
 运行命令：
 先运行 npm install
 后运行 node ./index.js

ps: 如想交易 $JUP ，就运行 node index_jup.js

担心有账户风险的话，就刷完把api key关掉
代码里的等待时间是1秒-3秒的随机数

==============

可以用我的邀请码注册 https://backpack.exchange/refer/6ae5687c-381d-484b-ac04-f2a2539fac53

也可以用源码大神zisan_xyz的邀请码注册backpack交易所：https://backpack.exchange/signup?referral=9ed76787-d966-4122-9a58-cd93d3a44de3

不会的用脚本的可以推特私信问大神： https://twitter.com/zisan_xyz

 没node的安装一下 这是教程：https://www.runoob.com/nodejs/nodejs-install-setup.html

 backpack 刷交易量 JavaScript 源码只刷sol/usdc，我改了以后可以刷 $JUP 
 在源码基础上增加了详细的解释
 注意事项：他们官网的api太多人用比较卡，可能在交易的时候会卡住，需要自己手动停止程序，重新运行

 ![image](https://github.com/catsats/backpack_exchange/assets/154321884/61503391-05ad-44d3-a121-6e6393907245)

 脚本运行详细：每次兑换一半余额的SOL换成USDC，再把所有USDC换成SOL。

 运行脚本需要把api keys填入进去
 ![image](https://github.com/catsats/backpack_exchange/assets/154321884/52850aab-6b10-4678-93d6-4b56d2be2449)

在这创建你的api keys https://backpack.exchange/settings/api-keys
![image](https://github.com/catsats/backpack_exchange/assets/154321884/9afa6f34-6d8f-495c-b6b7-e43c7f18cff5)
