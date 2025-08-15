// 四川移动集客奖金计算器脚本

document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const employeeTypeSelect = document.getElementById('employee-type');
    const zhankejingliInputs = document.getElementById('zhankejingli-inputs');
    const wgskInputs = document.getElementById('wgsk-inputs');
    const jfzxInputs = document.getElementById('jfzx-inputs');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultDiv = document.getElementById('result');
    const resultContent = document.getElementById('result-content');
    
    // 监听员工序列选择变化
    employeeTypeSelect.addEventListener('change', function() {
        // 隐藏所有输入区域
        zhankejingliInputs.classList.add('hidden');
        wgskInputs.classList.add('hidden');
        jfzxInputs.classList.add('hidden');
        resultDiv.classList.add('hidden');
        
        // 根据选择显示对应输入区域
        const selectedValue = this.value;
        if (selectedValue === 'zhankejingli') {
            zhankejingliInputs.classList.remove('hidden');
        } else if (selectedValue === 'shangkejingli' || selectedValue === 'wanggejingli' || selectedValue === 'wanggejingli-zhong') {
            wgskInputs.classList.remove('hidden');
        } else if (selectedValue === 'jiefangjingli' || selectedValue === 'zhongxinzhuren' || selectedValue === 'jiejuefangan' || 
                   selectedValue === 'zhankejingli-zhuren' || selectedValue === 'shangkejingli-zhuren' || 
                   selectedValue === 'zonghe-zhong' || selectedValue === 'zonghe-zhong-zhong') {
            jfzxInputs.classList.remove('hidden');
        }
    });
    
    // 木本业务赛道输入ID列表
    const zkMubenInputs = [
        'zk-muben-zhuanxian', 'zk-muben-yunmas', 'zk-muben-yunyewu',
        'zk-muben-wulianwang', 'zk-muben-5g', 'zk-muben-jiaoyu'
    ];
    
    // 战客经理其他产能输入ID列表
    const zkOtherInputs = ['zk-zs-xiangmu', 'zk-zs-zhixiao'];
    
    zkMubenInputs.forEach(inputId => {
        document.getElementById(inputId).addEventListener('input', updateZkMubenTotal);
    });
    
    function updateZkMubenTotal() {
        let total = 0;
        zkMubenInputs.forEach(inputId => {
            total += Number(document.getElementById(inputId).value) || 0;
        });
        document.getElementById('zk-muben-total').textContent = formatMoney(total) + ' 元';
        document.getElementById('zk-zs-muben').value = total;
        updateZkZsTotal();
    }
    
    // 实时计算战客经理增收赛道总产能
    document.getElementById('zk-zs-xiangmu').addEventListener('input', updateZkZsTotal);
    document.getElementById('zk-zs-zhixiao').addEventListener('input', updateZkZsTotal);
    
    function updateZkZsTotal() {
        const muben = Number(document.getElementById('zk-zs-muben').value) || 0;
        const xiangmu = Number(document.getElementById('zk-zs-xiangmu').value) || 0;
        const zhixiao = Number(document.getElementById('zk-zs-zhixiao').value) || 0;
        const otherTotal = xiangmu + zhixiao;
        const total = muben + otherTotal;
        document.getElementById('zk-zs-other-total').textContent = formatMoney(otherTotal) + ' 元';
        document.getElementById('zk-zs-total').textContent = formatMoney(total) + ' 元';
    }
    
    // 商客/网格客户经理木本业务输入ID列表
    const wgskMubenInputs = [
        'wgsk-gr-zhuanxian', 'wgsk-gr-yunmas', 'wgsk-gr-yunyewu',
        'wgsk-gr-wulianwang', 'wgsk-gr-5g', 'wgsk-gr-jiaoyu'
    ];
    
    // 实时计算网格/商客经理个人增收赛道总产能
    const wgskGrInputs = [
        'wgsk-gr-zhuanxian', 'wgsk-gr-yunmas', 'wgsk-gr-yunyewu',
        'wgsk-gr-wulianwang', 'wgsk-gr-5g', 'wgsk-gr-jiaoyu', 'wgsk-gr-xiangmu'
    ];
    
    wgskGrInputs.forEach(inputId => {
        document.getElementById(inputId).addEventListener('input', function() {
            updateWgskGrTotal();
            updateWgskTdTotal(); // 同时更新团队增收赛道
        });
    });
    
    function updateWgskGrTotal() {
        // 计算木本业务产能
        let mubenTotal = 0;
        wgskMubenInputs.forEach(inputId => {
            mubenTotal += Number(document.getElementById(inputId).value) || 0;
        });
        document.getElementById('wgsk-gr-muben-total').textContent = formatMoney(mubenTotal) + ' 元';
        
        // 计算项目IT产能
        const xiangmuTotal = Number(document.getElementById('wgsk-gr-xiangmu').value) || 0;
        
        // 计算个人增收赛道总产能（木本+项目IT）
        const grTotal = mubenTotal + xiangmuTotal;
        document.getElementById('wgsk-gr-total').textContent = formatMoney(grTotal) + ' 元';
    }
    
    // 实时计算网格/商客经理团队增收赛道总产能
    document.getElementById('wgsk-td-jiedui').addEventListener('input', updateWgskTdTotal);
    
    function updateWgskTdTotal() {
        // 获取木本业务产能
        let mubenTotal = 0;
        wgskGrInputs.forEach(inputId => {
            if (inputId !== 'wgsk-gr-xiangmu') { // 排除项目IT产能
                mubenTotal += Number(document.getElementById(inputId).value) || 0;
            }
        });
        
        // 获取项目IT产能
        const xiangmuTotal = Number(document.getElementById('wgsk-gr-xiangmu').value) || 0;
        
        // 获取直销队产能
        const zhixiaoTotal = Number(document.getElementById('wgsk-td-jiedui').value) || 0;
        
        // 计算团队增收赛道总产能（木本+直销队+项目IT）
        const tdTotal = mubenTotal + zhixiaoTotal + xiangmuTotal;
        document.getElementById('wgsk-td-total').textContent = formatMoney(tdTotal) + ' 元';
    }
    
    // 解决方案经理/中心主任木本业务输入ID列表
    const jfzxMubenInputs = [
        'jfzx-zhuanxian', 'jfzx-yunmas', 'jfzx-yunyewu',
        'jfzx-wulianwang', 'jfzx-5g', 'jfzx-jiaoyu'
    ];
    
    // 解决方案经理/中心主任其他产能输入ID列表
    const jfzxOtherInputs = ['jfzx-xiangmu', 'jfzx-zhixiao'];
    
    // 实时计算解决方案经理/中心主任总产能
    const jfzxInputIds = [
        'jfzx-zhuanxian', 'jfzx-yunmas', 'jfzx-yunyewu',
        'jfzx-wulianwang', 'jfzx-5g', 'jfzx-jiaoyu', 'jfzx-xiangmu', 'jfzx-zhixiao'
    ];
    
    jfzxInputIds.forEach(inputId => {
        document.getElementById(inputId).addEventListener('input', updateJfzxTotal);
    });
    
    function updateJfzxTotal() {
        // 计算木本业务产能
        let mubenTotal = 0;
        jfzxMubenInputs.forEach(inputId => {
            mubenTotal += Number(document.getElementById(inputId).value) || 0;
        });
        document.getElementById('jfzx-muben-total').textContent = formatMoney(mubenTotal) + ' 元';
        
        // 计算其他产能
        let xiangmuTotal = Number(document.getElementById('jfzx-xiangmu').value) || 0;
        let zhixiaoTotal = Number(document.getElementById('jfzx-zhixiao').value) || 0;
        let otherTotal = xiangmuTotal + zhixiaoTotal;
        document.getElementById('jfzx-other-total').textContent = formatMoney(otherTotal) + ' 元';
        
        // 计算总产能
        let total = mubenTotal + otherTotal;
        document.getElementById('jfzx-total').textContent = formatMoney(total) + ' 元';
    }
    
    // 计算奖金按钮点击事件
    calculateBtn.addEventListener('click', function() {
        const employeeType = employeeTypeSelect.value;
        if (!employeeType) {
            alert('请选择员工序列');
            return;
        }
        
        let bonusResult = '';
        let totalBonus = 0;
        
        // 根据不同员工序列计算奖金
        if (employeeType === 'zhankejingli') {
            // 战客经理奖金计算
            // 计算木本业务产能
            let mubenTotal = 0;
            zkMubenInputs.forEach(inputId => {
                mubenTotal += Number(document.getElementById(inputId).value) || 0;
            });
            
            // 计算项目IT产能和直销队产能
            let xiangmuTotal = Number(document.getElementById('zk-zs-xiangmu').value) || 0;
            let zhixiaoTotal = Number(document.getElementById('zk-zs-zhixiao').value) || 0;
            
            // 计算总产能
            let zsTotal = mubenTotal + xiangmuTotal + zhixiaoTotal;
            
            // 木本业务赛道奖金计算 (实际规则)
            let mubenBonus = calculateZkMubenBonus(mubenTotal);
            
            // 增收赛道奖金计算 (实际规则)
            let zsBonus = calculateZkZsBonus(zsTotal);
            
            // 确保不超过上限
            mubenBonus = Math.min(mubenBonus, 3000);
            zsBonus = Math.min(zsBonus, 5000);
            
            totalBonus = mubenBonus + zsBonus;
            
            bonusResult = `
                <div class="result-detail">
                    <div class="result-row">
                        <span>木本业务产能：</span>
                        <span>${formatMoney(mubenTotal)} 元</span>
                    </div>
                    <div class="result-row highlight">
                        <span>一赛道奖金（木本业务）：</span>
                        <span>${formatMoney(mubenBonus)} 元</span>
                    </div>
                    <div class="result-row">
                        <span>增收赛道产能（木本+项目+直销队）：</span>
                        <span>${formatMoney(zsTotal)} 元</span>
                    </div>
                    <div class="result-row highlight">
                        <span>二赛道奖金（增收赛道）：</span>
                        <span>${formatMoney(zsBonus)} 元</span>
                    </div>
                </div>
                <div class="result-total">
                    <div class="result-row">
                        <span>当月奖金总额：</span>
                        <span>${formatMoney(totalBonus)} 元</span>
                    </div>
                </div>
            `;
        } else if (employeeType === 'shangkejingli' || employeeType === 'wanggejingli' || employeeType === 'wanggejingli-zhong') {
            // 商客/网格客户经理奖金计算
            // 计算木本业务产能
            let mubenTotal = 0;
            wgskGrInputs.forEach(inputId => {
                mubenTotal += Number(document.getElementById(inputId).value) || 0;
            });
            
            // 计算其他产能（项目IT和直销队）
            let xiangmuTotal = Number(document.getElementById('wgsk-gr-xiangmu').value) || 0;
            let zhixiaoTotal = Number(document.getElementById('wgsk-td-jiedui').value) || 0;
            
            // 计算个人增收赛道产能 (一赛道) - 木本业务+项目IT
            let grTotal = mubenTotal + xiangmuTotal;
            
            // 计算团队增收赛道产能 (二赛道) - 木本业务+直销队+项目IT
            let tdTotal = mubenTotal + zhixiaoTotal + xiangmuTotal;
            
            // 个人增收赛道奖金计算 (一赛道)
            let grBonus = calculateWgskGrBonus(grTotal, employeeType);
            
            // 团队增收赛道奖金计算 (二赛道)
            let tdBonus = calculateWgskTdBonus(tdTotal, employeeType);
            
            // 确保不超过上限
            grBonus = Math.min(grBonus, 3000);
            tdBonus = Math.min(tdBonus, 5000);
            
            totalBonus = grBonus + tdBonus;
            
            bonusResult = `
                <div class="result-detail">
                    <div class="result-row">
                        <span>木本业务产能：</span>
                        <span>${formatMoney(mubenTotal)} 元</span>
                    </div>
                    <div class="result-row">
                        <span>个人增收赛道产能（木本+项目）：</span>
                        <span>${formatMoney(grTotal)} 元</span>
                    </div>
                    <div class="result-row highlight">
                        <span>一赛道奖金（个人增收）：</span>
                        <span>${formatMoney(grBonus)} 元</span>
                    </div>
                    <div class="result-row">
                        <span>团队增收赛道产能（木本+直销队+项目）：</span>
                        <span>${formatMoney(tdTotal)} 元</span>
                    </div>
                    <div class="result-row highlight">
                        <span>二赛道奖金（团队增收）：</span>
                        <span>${formatMoney(tdBonus)} 元</span>
                    </div>
                </div>
                <div class="result-total">
                    <div class="result-row">
                        <span>当月奖金总额：</span>
                        <span>${formatMoney(totalBonus)} 元</span>
                    </div>
                </div>
            `;
        } else if (employeeType === 'jiefangjingli' || employeeType === 'zhongxinzhuren' || employeeType === 'jiejuefangan' || employeeType === 'zhankejingli-zhuren' || employeeType === 'shangkejingli-zhuren' || employeeType === 'zonghe-zhong' || employeeType === 'zonghe-zhong-zhong') {
            // 解决方案经理/中心主任奖金计算
            // 计算木本业务产能
            let mubenTotal = 0;
            jfzxMubenInputs.forEach(inputId => {
                mubenTotal += Number(document.getElementById(inputId).value) || 0;
            });
            
            // 计算其他产能（项目IT和直销队）
            let xiangmuTotal = Number(document.getElementById('jfzx-xiangmu').value) || 0;
            let zhixiaoTotal = Number(document.getElementById('jfzx-zhixiao').value) || 0;
            let otherTotal = xiangmuTotal + zhixiaoTotal;
            
            // 计算总产能
            let totalCapacity = mubenTotal + otherTotal;
            
            // 根据产能计算奖金 (实际规则)
            let bonus = calculateJfzxBonus(totalCapacity, employeeType);
            totalBonus = bonus;
            
            bonusResult = `
                <div class="result-detail">
                    <div class="result-row">
                        <span>木本业务产能：</span>
                        <span>${formatMoney(mubenTotal)} 元</span>
                    </div>
                    <div class="result-row">
                        <span>其他产能（项目+直销队）：</span>
                        <span>${formatMoney(otherTotal)} 元</span>
                    </div>
                    <div class="result-row">
                        <span>当月总产能：</span>
                        <span>${formatMoney(totalCapacity)} 元</span>
                    </div>
                </div>
                <div class="result-total">
                    <div class="result-row highlight">
                        <span>当月奖金总额：</span>
                        <span>${formatMoney(totalBonus)} 元</span>
                    </div>
                </div>
            `;
        }
        
        // 显示结果
        resultContent.innerHTML = bonusResult;
        resultDiv.classList.remove('hidden');
        
        // 滚动到结果区域
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    });
    
    // 格式化金额
    function formatMoney(amount) {
        // 确保amount是数字类型
        amount = Number(amount);
        // 使用toLocaleString格式化数字，确保正确显示
        return amount.toLocaleString('zh-CN', {maximumFractionDigits: 0});
    }
    
    // 战客经理木本业务赛道奖金计算函数 (实际规则)
    function calculateZkMubenBonus(amount) {
        // 目标值
        const target1 = 3462; // 第一档目标 ≥120%
        const target2 = 2885; // 第二档目标 100%-120%
        const target3 = 2308; // 第三档目标 80%-100%
        
        // 计算完成率
        const completionRate = amount / target2; // 以100%目标为基准
        
        // 根据完成率确定奖金
        if (completionRate >= 1.2) { // ≥120%
            return amount * 0.4; // 40%激励
        } else if (completionRate >= 1.0) { // 100%-120%
            return amount * 0.3; // 30%激励
        } else if (completionRate >= 0.8) { // 80%-100%
            return amount * 0.2; // 20%激励
        } else {
            return 0; // 低于80%不发奖金
        }
    }
    
    // 战客经理增收赛道奖金计算函数 (实际规则)
    function calculateZkZsBonus(amount) {
        // 目标值
        const target1 = 7756; // 第一档目标 ≥120%
        const target2 = 6463; // 第二档目标 100%-120%
        const target3 = 5171; // 第三档目标 80%-100%
        
        // 计算完成率
        const completionRate = amount / target2; // 以100%目标为基准
        
        // 根据完成率确定奖金
        let bonus = 0;
        if (completionRate >= 1.2) { // ≥120%
            bonus = amount * 0.4; // 40%激励
        } else if (completionRate >= 1.0) { // 100%-120%
            bonus = amount * 0.3; // 30%激励
        } else if (completionRate >= 0.8) { // 80%-100%
            bonus = amount * 0.2; // 20%激励
        }
        
        // 单人上限5000
        return Math.min(bonus, 5000);
    }
    
    // 网格/商客经理个人增收赛道奖金计算函数 (实际规则)
    function calculateWgskGrBonus(amount, employeeType) {
        // 根据员工类型确定目标值
        let target1, target2, target3;
        
        if (employeeType === 'shangkejingli') {
            // 商客经理
            target1 = 1800; // 第一档目标 ≥120%
            target2 = 1500; // 第二档目标 100%-120%
            target3 = 1200; // 第三档目标 80%-100%
        } else if (employeeType === 'wanggejingli-zhong') {
            // 网格客户经理（中属性）
            target1 = 4320; // 第一档目标 ≥120%
            target2 = 3600; // 第二档目标 100%-120%
            target3 = 2880; // 第三档目标 80%-100%
        } else { // 默认为网格客户经理（重属性）
            target1 = 5280; // 第一档目标 ≥120%
            target2 = 4400; // 第二档目标 100%-120%
            target3 = 3520; // 第三档目标 80%-100%
        }
        
        // 计算完成率
        const completionRate = amount / target2; // 以100%目标为基准
        
        // 根据完成率确定奖金
        let bonus = 0;
        let rate = 0;
        
        if (employeeType === 'shangkejingli') {
            // 商客经理激励比例
            if (completionRate >= 1.2) { // ≥120%
                rate = 0.3; // 30%激励
            } else if (completionRate >= 1.0) { // 100%-120%
                rate = 0.2; // 20%激励
            } else if (completionRate >= 0.8) { // 80%-100%
                rate = 0.1; // 10%激励
            }
        } else { // 网格客户经理（中属性和重属性）激励比例相同
            if (completionRate >= 1.2) { // ≥120%
                rate = 0.2; // 20%激励
            } else if (completionRate >= 1.0) { // 100%-120%
                rate = 0.1; // 10%激励
            } else if (completionRate >= 0.8) { // 80%-100%
                rate = 0.05; // 5%激励
            }
        }
        
        bonus = amount * rate;
        
        // 单人上限3000
        return Math.min(bonus, 3000);
    }
    
    // 网格/商客经理团队增收赛道奖金计算函数 (实际规则)
    function calculateWgskTdBonus(amount, employeeType) {
        // 根据员工类型确定目标值
        let target1, target2, target3;
        
        if (employeeType === 'shangkejingli') {
            // 商客经理
            target1 = 42000; // 第一档目标 ≥120%
            target2 = 35000; // 第二档目标 100%-120%
            target3 = 28000; // 第三档目标 80%-100%
        } else if (employeeType === 'wanggejingli-zhong') {
            // 网格客户经理（中属性）
            target1 = 9120; // 第一档目标 ≥120%
            target2 = 7600; // 第二档目标 100%-120%
            target3 = 6080; // 第三档目标 80%-100%
        } else { // 默认为网格客户经理（重属性）
            target1 = 15300; // 第一档目标 ≥120%
            target2 = 12700; // 第二档目标 100%-120%
            target3 = 10200; // 第三档目标 80%-100%
        }
        
        // 计算完成率
        const completionRate = amount / target2; // 以100%目标为基准
        
        // 根据完成率确定奖金
        let bonus = 0;
        let rate = 0;
        
        if (employeeType === 'shangkejingli') {
            // 商客经理激励比例
            if (completionRate >= 1.2) { // ≥120%
                rate = 0.04; // 4%激励
            } else if (completionRate >= 1.0) { // 100%-120%
                rate = 0.03; // 3%激励
            } else if (completionRate >= 0.8) { // 80%-100%
                rate = 0.02; // 2%激励
            }
        } else { // 网格客户经理（中属性和重属性）激励比例相同
            if (completionRate >= 1.2) { // ≥120%
                rate = 0.2; // 20%激励
            } else if (completionRate >= 1.0) { // 100%-120%
                rate = 0.1; // 10%激励
            } else if (completionRate >= 0.8) { // 80%-100%
                rate = 0.05; // 5%激励
            }
        }
        
        bonus = amount * rate;
        
        // 单人上限5000
        return Math.min(bonus, 5000);
    }
    
    // 解决方案经理/中心主任奖金计算函数 (实际规则)
    function calculateJfzxBonus(amount, employeeType) {
        let bonus = 0;
        
        if (employeeType === 'jiejuefangan') {
            // 解决方案经理
            const target = 20000; // 目标产能
            const completionRate = amount / target;
            
            if (completionRate >= 1.0) { // 超过目标产能
                // 产能目标完成率*1000
                bonus = completionRate * 1000;
                // 单月单人5000封顶
                return Math.min(bonus, 5000);
            }
            return 0;
        } else if (employeeType === 'jiefangjingli') {
            // 解放经理
            const target = 15000; // 目标产能
            const completionRate = amount / target;
            
            if (completionRate >= 1.0) { // 超过目标产能
                // 产能目标完成率*800
                bonus = completionRate * 800;
                // 单月单人4000封顶
                return Math.min(bonus, 4000);
            }
            return 0;
        } else {
            // 中心主任序列
            let target1, target2, target3;
            
            if (employeeType === 'zhankejingli-zhuren') {
                // 战客中心主任
                target1 = 20772; // 第一档目标 ≥120%
                target2 = 17310; // 第二档目标 100%-120%
                target3 = 13848; // 第三档目标 80%-100%
            } else if (employeeType === 'shangkejingli-zhuren') {
                // 商客中心主任
                target1 = 86400; // 第一档目标 ≥120%
                target2 = 72000; // 第二档目标 100%-120%
                target3 = 57600; // 第三档目标 80%-100%
            } else if (employeeType === 'zonghe-zhong') {
                // 综合服务中心主任（中属性）
                target1 = 22800; // 第一档目标 ≥120%
                target2 = 19000; // 第二档目标 100%-120%
                target3 = 15200; // 第三档目标 80%-100%
            } else if (employeeType === 'zonghe-zhong-zhong') { // 综合服务中心主任（重属性）
                target1 = 38400; // 第一档目标 ≥120%
                target2 = 32000; // 第二档目标 100%-120%
                target3 = 25600; // 第三档目标 80%-100%
            }
            
            // 计算完成率
            const completionRate = amount / target2; // 以100%目标为基准
            
            // 根据完成率确定奖金
            if (completionRate >= 1.2) { // ≥120%
                if (employeeType === 'zonghe-zhong') {
                    bonus = 3000; // 综合服务中心主任（中属性）第一档奖金
                } else {
                    bonus = 5000; // 其他中心主任第一档奖金
                }
            } else if (completionRate >= 1.0) { // 100%-120%
                if (employeeType === 'zonghe-zhong') {
                    bonus = 1800; // 综合服务中心主任（中属性）第二档奖金
                } else {
                    bonus = 3000; // 其他中心主任第二档奖金
                }
            } else if (completionRate >= 0.8) { // 80%-100%
                if (employeeType === 'zonghe-zhong') {
                    bonus = 1200; // 综合服务中心主任（中属性）第三档奖金
                } else {
                    bonus = 2000; // 其他中心主任第三档奖金
                }
            }
            
            return bonus;
        }
    }
});