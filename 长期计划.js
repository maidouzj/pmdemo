const groups = document.querySelectorAll('.menu-group');
const menuItems = document.querySelectorAll('.submenu-item, .single-menu-item');
const topLinks = document.querySelectorAll('.top-nav a');
const collapseButton = document.querySelector('.collapse-button');
const overviewToggle = document.querySelector('#overview-toggle');
const overviewDetails = document.querySelector('#overview-details');
const listPanel = document.querySelector('.list-panel');
const pageContent = document.querySelector('.content');
const createPlanButton = document.querySelector('#create-plan-button');
const longTermPage = document.querySelector('#long-term-page');
const audienceTemplatePage = document.querySelector('#audience-template-page');
const planGroupPage = document.querySelector('#plan-group-page');
const deliveryStatisticsPage = document.querySelector('#delivery-statistics-page');
const financeReportPage = document.querySelector('#finance-report-page');
const shortVideoStatisticsPage = document.querySelector('#short-video-statistics-page');
const autoShutdownPage = document.querySelector('#auto-shutdown-page');
const deliveryAccountPage = document.querySelector('#delivery-account-page');
const dateTypeSelect = document.querySelector('#date-type-select');
const dateTypeTrigger = document.querySelector('#date-type-trigger');
const dateTypeLabel = document.querySelector('#date-type-label');
const dateTypeOptions = document.querySelector('#date-type-options');
const planStatusFilter = document.querySelector('#plan-status-filter');
const longTermFilterReset = document.querySelector('#long-term-filter-reset');

function closeDateTypeOptions() {
  dateTypeOptions.hidden = true;
  dateTypeTrigger.setAttribute('aria-expanded', 'false');
}

dateTypeTrigger.addEventListener('click', () => {
  const willOpen = dateTypeOptions.hidden;
  dateTypeOptions.hidden = !willOpen;
  dateTypeTrigger.setAttribute('aria-expanded', String(willOpen));
});

dateTypeOptions.addEventListener('click', (event) => {
  const option = event.target.closest('[data-date-type]');
  if (!option) return;
  dateTypeLabel.textContent = option.dataset.dateType;
  dateTypeOptions.querySelectorAll('[data-date-type]').forEach((item) => {
    item.setAttribute('aria-selected', String(item === option));
  });
  closeDateTypeOptions();
});

document.addEventListener('click', (event) => {
  if (!dateTypeSelect.contains(event.target)) closeDateTypeOptions();
});

groups.forEach((group) => {
  const trigger = group.querySelector('.menu-group-title');
  trigger.addEventListener('click', () => {
    const isOpen = group.classList.toggle('open');
    trigger.setAttribute('aria-expanded', String(isOpen));
  });
});

menuItems.forEach((item) => {
  item.addEventListener('click', () => {
    menuItems.forEach((candidate) => candidate.classList.remove('active'));
    item.classList.add('active');
    const showLongTermPlan = item.dataset.page === 'long-term-plan';
    const showAudienceTemplate = item.dataset.page === 'audience-template';
    const showPlanGroup = item.dataset.page === 'plan-group';
    const showDeliveryStatistics = item.dataset.page === 'delivery-statistics';
    const showFinanceReport = item.dataset.page === 'finance-report';
    const showShortVideoStatistics = item.dataset.page === 'short-video-statistics';
    const showAutoShutdown = item.dataset.page === 'auto-shutdown';
    const showDeliveryAccount = item.dataset.page === 'delivery-account';
    longTermPage.hidden = !showLongTermPlan;
    audienceTemplatePage.hidden = !showAudienceTemplate;
    planGroupPage.hidden = !showPlanGroup;
    deliveryStatisticsPage.hidden = !showDeliveryStatistics;
    financeReportPage.hidden = !showFinanceReport;
    shortVideoStatisticsPage.hidden = !showShortVideoStatistics;
    autoShutdownPage.hidden = !showAutoShutdown;
    deliveryAccountPage.hidden = !showDeliveryAccount;
    pageContent.classList.toggle('is-blank', !showLongTermPlan && !showAudienceTemplate && !showPlanGroup && !showDeliveryStatistics && !showFinanceReport && !showShortVideoStatistics && !showAutoShutdown && !showDeliveryAccount);
    pageContent.setAttribute('aria-label', showLongTermPlan
      ? '长期计划页面内容'
      : (showAudienceTemplate ? '定向人群模板页面内容' : (showPlanGroup ? '计划分组页面内容' : (showDeliveryStatistics ? '直播间投放统计页面内容' : (showFinanceReport ? '财务报表页面内容' : (showShortVideoStatistics ? '短视频统计页面内容' : (showAutoShutdown ? '自动关停策略页面内容' : (showDeliveryAccount ? '投放号管理页面内容' : '空白页面内容'))))))));

    if (!showLongTermPlan) {
      document.querySelector('#column-settings-panel').hidden = true;
      document.querySelector('#data-drawer-layer').hidden = true;
    }
    if (!showDeliveryStatistics) document.querySelector('#statistics-column-settings-panel').hidden = true;
    if (!showShortVideoStatistics) document.querySelector('#short-video-detail-layer').hidden = true;
    if (!showAutoShutdown) document.querySelector('#shutdown-strategy-modal').hidden = true;
    if (!showDeliveryAccount) document.querySelector('#offline-reminder-modal').hidden = true;
  });
});

const statisticsSettingsButton = document.querySelector('#statistics-column-settings-button');
const statisticsSettingsPanel = document.querySelector('#statistics-column-settings-panel');
const statisticsSettingsClose = document.querySelector('#statistics-column-close');
const statisticsSettingsCancel = document.querySelector('#statistics-column-cancel');
const statisticsSettingsConfirm = document.querySelector('#statistics-column-confirm');
const statisticsColumnSearch = document.querySelector('#statistics-column-search');
const statisticsColumnSelectAll = document.querySelector('#statistics-column-select-all');
const statisticsSelectedColumnPanelCount = document.querySelector('#statistics-selected-column-panel-count');
const statisticsClearSelectedColumnsButton = document.querySelector('#statistics-clear-selected-columns');
const statisticsColumnOptions = document.querySelector('#statistics-column-options');
const statisticsSelectedColumns = document.querySelector('#statistics-selected-columns');
const statisticsRefreshButton = document.querySelector('#statistics-refresh-button');
const statisticsOrderTypeFilter = document.querySelector('#statistics-order-type-filter');
const statisticsOrderTypeTrigger = document.querySelector('#statistics-order-type-trigger');
const statisticsOrderTypeLabel = document.querySelector('#statistics-order-type-label');
const statisticsOrderTypePanel = document.querySelector('#statistics-order-type-panel');
const statisticsOrderTypeOptions = statisticsOrderTypePanel.querySelectorAll('[data-statistics-order-type]');
const statisticsResetButton = document.querySelector('#statistics-reset');
const selectedStatisticsOrderTypes = new Set();
const statisticsColumnFields = Array.from(document.querySelectorAll('#delivery-statistics-page .statistics-table thead th'))
  .map((cell) => cell.textContent.replace('?', '').trim());
let savedStatisticsColumns = [...statisticsColumnFields];
let draftStatisticsColumns = [...savedStatisticsColumns];
let draggedStatisticsColumn = '';

function renderStatisticsColumnSettings() {
  const keyword = statisticsColumnSearch.value.trim().toLowerCase();
  const visibleFields = statisticsColumnFields.filter((field) => field.toLowerCase().includes(keyword));
  statisticsColumnOptions.innerHTML = visibleFields.map((field) => `
    <label class="statistics-column-option">
      <input type="checkbox" value="${field}" ${draftStatisticsColumns.includes(field) ? 'checked' : ''}>
      <span>${field}</span>
    </label>
  `).join('');

  statisticsSelectedColumns.innerHTML = draftStatisticsColumns.length ? draftStatisticsColumns.map((field) => `
    <div class="statistics-selected-column" draggable="true" data-statistics-column="${field}">
      <span class="statistics-column-drag" aria-hidden="true">☰</span>
      <span>${field}</span>
      <button type="button" data-remove-statistics-column="${field}" aria-label="移除${field}">×</button>
    </div>
  `).join('') : `
    <div class="statistics-selected-column-empty">
      <span>暂无已选字段</span>
      <p>请从左侧勾选需要展示的字段</p>
    </div>
  `;

  statisticsSelectedColumnPanelCount.textContent = String(draftStatisticsColumns.length);
  statisticsClearSelectedColumnsButton.disabled = draftStatisticsColumns.length === 0;
  statisticsColumnSelectAll.checked = draftStatisticsColumns.length === statisticsColumnFields.length;
  statisticsColumnSelectAll.indeterminate = draftStatisticsColumns.length > 0 && !statisticsColumnSelectAll.checked;
}

function applyStatisticsColumns() {
  const orderedFields = [
    ...savedStatisticsColumns,
    ...statisticsColumnFields.filter((field) => !savedStatisticsColumns.includes(field))
  ];
  const rows = Array.from(document.querySelectorAll('#delivery-statistics-page .statistics-table tr'));
  const currentFieldOrder = Array.from(rows[0].children)
    .map((cell) => cell.textContent.replace('?', '').trim());
  rows.forEach((row) => {
    const cells = Array.from(row.children);
    const cellByField = new Map(currentFieldOrder.map((field, index) => [field, cells[index]]));
    orderedFields.forEach((field) => {
      const cell = cellByField.get(field);
      if (!cell) return;
      cell.hidden = !savedStatisticsColumns.includes(field);
      row.appendChild(cell);
    });
  });
}

function closeStatisticsSettings() {
  statisticsSettingsPanel.hidden = true;
  statisticsSettingsButton.setAttribute('aria-expanded', 'false');
}

statisticsSettingsButton.addEventListener('click', () => {
  draftStatisticsColumns = [...savedStatisticsColumns];
  statisticsColumnSearch.value = '';
  renderStatisticsColumnSettings();
  statisticsSettingsPanel.hidden = false;
  statisticsSettingsButton.setAttribute('aria-expanded', 'true');
});
statisticsSettingsClose.addEventListener('click', closeStatisticsSettings);
statisticsSettingsCancel.addEventListener('click', closeStatisticsSettings);
statisticsSettingsConfirm.addEventListener('click', () => {
  savedStatisticsColumns = [...draftStatisticsColumns];
  applyStatisticsColumns();
  closeStatisticsSettings();
});
statisticsSettingsPanel.addEventListener('click', (event) => {
  if (event.target === statisticsSettingsPanel) closeStatisticsSettings();
});
statisticsColumnSearch.addEventListener('input', renderStatisticsColumnSettings);
statisticsColumnSelectAll.addEventListener('change', () => {
  draftStatisticsColumns = statisticsColumnSelectAll.checked ? [...statisticsColumnFields] : [];
  renderStatisticsColumnSettings();
});
statisticsClearSelectedColumnsButton.addEventListener('click', () => {
  if (draftStatisticsColumns.length === 0) return;
  draftStatisticsColumns = [];
  renderStatisticsColumnSettings();
});
statisticsColumnOptions.addEventListener('change', (event) => {
  if (!event.target.matches('input[type="checkbox"]')) return;
  const field = event.target.value;
  if (event.target.checked) {
    if (!draftStatisticsColumns.includes(field)) draftStatisticsColumns.push(field);
  } else {
    draftStatisticsColumns = draftStatisticsColumns.filter((item) => item !== field);
  }
  renderStatisticsColumnSettings();
});
statisticsSelectedColumns.addEventListener('click', (event) => {
  const removeButton = event.target.closest('[data-remove-statistics-column]');
  if (!removeButton) return;
  draftStatisticsColumns = draftStatisticsColumns.filter((field) => field !== removeButton.dataset.removeStatisticsColumn);
  renderStatisticsColumnSettings();
});
statisticsSelectedColumns.addEventListener('dragstart', (event) => {
  const item = event.target.closest('[data-statistics-column]');
  if (!item) return;
  draggedStatisticsColumn = item.dataset.statisticsColumn;
  item.classList.add('is-dragging');
});
statisticsSelectedColumns.addEventListener('dragend', (event) => {
  event.target.closest('[data-statistics-column]')?.classList.remove('is-dragging');
  draggedStatisticsColumn = '';
});
statisticsSelectedColumns.addEventListener('dragover', (event) => {
  const target = event.target.closest('[data-statistics-column]');
  if (!target || !draggedStatisticsColumn || target.dataset.statisticsColumn === draggedStatisticsColumn) return;
  event.preventDefault();
});
statisticsSelectedColumns.addEventListener('drop', (event) => {
  const target = event.target.closest('[data-statistics-column]');
  if (!target || !draggedStatisticsColumn || target.dataset.statisticsColumn === draggedStatisticsColumn) return;
  event.preventDefault();
  const fromIndex = draftStatisticsColumns.indexOf(draggedStatisticsColumn);
  const toIndex = draftStatisticsColumns.indexOf(target.dataset.statisticsColumn);
  draftStatisticsColumns.splice(fromIndex, 1);
  draftStatisticsColumns.splice(toIndex, 0, draggedStatisticsColumn);
  renderStatisticsColumnSettings();
});
statisticsRefreshButton.addEventListener('click', () => {
  statisticsRefreshButton.animate(
    [{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }],
    { duration: 420, easing: 'ease-out' }
  );
});

function updateStatisticsOrderTypeLabel() {
  const selectedTypes = [...selectedStatisticsOrderTypes];
  statisticsOrderTypeLabel.textContent = selectedTypes.length ? selectedTypes.join('、') : '选择计划类型';
  statisticsOrderTypeTrigger.classList.toggle('has-value', selectedTypes.length > 0);
}

function closeStatisticsOrderTypeFilter() {
  statisticsOrderTypePanel.hidden = true;
  statisticsOrderTypeTrigger.setAttribute('aria-expanded', 'false');
}

function renderStatisticsRows() {
  document.querySelectorAll('#delivery-statistics-page .statistics-table tbody tr').forEach((row) => {
    row.hidden = selectedStatisticsOrderTypes.size > 0 && !selectedStatisticsOrderTypes.has(row.dataset.orderType);
  });
}

statisticsOrderTypeTrigger.addEventListener('click', () => {
  const nextOpen = statisticsOrderTypePanel.hidden;
  statisticsOrderTypePanel.hidden = !nextOpen;
  statisticsOrderTypeTrigger.setAttribute('aria-expanded', String(nextOpen));
});

statisticsOrderTypePanel.addEventListener('click', (event) => {
  const option = event.target.closest('[data-statistics-order-type]');
  if (!option) return;
  const planType = option.dataset.statisticsOrderType;
  if (selectedStatisticsOrderTypes.has(planType)) selectedStatisticsOrderTypes.delete(planType);
  else selectedStatisticsOrderTypes.add(planType);
  const isSelected = selectedStatisticsOrderTypes.has(planType);
  option.classList.toggle('is-selected', isSelected);
  option.setAttribute('aria-selected', String(isSelected));
  updateStatisticsOrderTypeLabel();
  renderStatisticsRows();
});

statisticsResetButton.addEventListener('click', () => {
  selectedStatisticsOrderTypes.clear();
  statisticsOrderTypeOptions.forEach((option) => {
    option.classList.remove('is-selected');
    option.setAttribute('aria-selected', 'false');
  });
  updateStatisticsOrderTypeLabel();
  closeStatisticsOrderTypeFilter();
  renderStatisticsRows();
});

document.addEventListener('click', (event) => {
  if (!statisticsOrderTypeFilter.contains(event.target)) closeStatisticsOrderTypeFilter();
});

topLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    topLinks.forEach((candidate) => candidate.classList.remove('active'));
    link.classList.add('active');
  });
});

collapseButton.addEventListener('click', () => {
  const collapsed = document.body.classList.toggle('sidebar-collapsed');
  collapseButton.setAttribute('aria-label', collapsed ? '展开侧边栏' : '收起侧边栏');
});

createPlanButton.addEventListener('click', () => {
  window.location.href = '新建长期计划.html';
});

overviewToggle.addEventListener('click', () => {
  const expanded = overviewToggle.getAttribute('aria-expanded') === 'true';
  const nextExpanded = !expanded;
  overviewToggle.setAttribute('aria-expanded', String(nextExpanded));
  overviewToggle.querySelector('.expand-label').textContent = expanded ? '展开' : '收起';
  overviewDetails.hidden = expanded;
  listPanel.hidden = nextExpanded;
});

const mainTrendTabs = Array.from(document.querySelectorAll('[data-trend-mode]'));
const mainTrendChart = document.querySelector('#main-trend-chart');
const mainTrendSvg = document.querySelector('#main-trend-svg');
const mainTrendTooltip = document.querySelector('#main-trend-tooltip');
const mainTrendData = {
  day: [
    { time: '2026-07-09', spend: 0, orders: 0, amount: 0, roi: 0 },
    { time: '2026-07-10', spend: 35.8, orders: 0, amount: 0, roi: 0 },
    { time: '2026-07-11', spend: 83.2, orders: 0, amount: 0, roi: 0 },
    { time: '2026-07-12', spend: 126.5, orders: 0, amount: 0, roi: 0 },
    { time: '2026-07-13', spend: 187.56, orders: 0, amount: 0, roi: 0 }
  ],
  hour: [
    { time: '2026-07-13 00:00', spend: 0, orders: 0, amount: 0, roi: 0 },
    { time: '2026-07-13 06:00', spend: 35.8, orders: 0, amount: 0, roi: 0 },
    { time: '2026-07-13 12:00', spend: 83.2, orders: 0, amount: 0, roi: 0 },
    { time: '2026-07-13 18:00', spend: 126.5, orders: 0, amount: 0, roi: 0 },
    { time: '2026-07-13 23:00', spend: 187.56, orders: 0, amount: 0, roi: 0 }
  ]
};
const mainTrendSeries = [
  { key: 'spend', label: '消耗金额', className: 'consume', format: (value) => `¥${value.toFixed(2)}` },
  { key: 'orders', label: '总成交订单数', className: 'order', format: (value) => String(value) },
  { key: 'amount', label: '总成交订单金额', className: 'amount', format: (value) => `¥${value.toFixed(2)}` },
  { key: 'roi', label: '成交ROI', className: 'roi', format: (value) => value.toFixed(2) }
];
let mainTrendMode = 'hour';
let mainTrendPoints = [];

function renderMainTrend() {
  const rows = mainTrendData[mainTrendMode];
  const left = 30;
  const right = 970;
  const top = 16;
  const bottom = 170;
  const maxValue = Math.max(1, ...rows.flatMap((row) => mainTrendSeries.map((series) => Number(row[series.key]) || 0)));
  mainTrendPoints = rows.map((row, index) => ({
    row,
    x: left + ((right - left) * index / Math.max(1, rows.length - 1))
  }));
  const seriesMarkup = mainTrendSeries.map((series) => {
    const points = mainTrendPoints.map(({ row, x }) => `${x},${bottom - ((Number(row[series.key]) || 0) / maxValue) * (bottom - top)}`).join(' ');
    return `<polyline class="trend-series trend-series-${series.className}" points="${points}"></polyline>`;
  }).join('');
  const labels = mainTrendPoints.map(({ row, x }) => `<text class="trend-axis-label" x="${x}" y="198">${mainTrendMode === 'day' ? row.time.slice(5) : row.time.slice(11)}</text>`).join('');
  mainTrendSvg.innerHTML = `${seriesMarkup}${labels}<g id="main-trend-hover" visibility="hidden"><line class="trend-hover-line" x1="0" y1="${top}" x2="0" y2="${bottom}"></line>${mainTrendSeries.map((series) => `<circle class="trend-hover-point trend-series-${series.className}" cx="0" cy="0" r="4"></circle>`).join('')}</g>`;
  mainTrendTooltip.hidden = true;
}

mainTrendTabs.forEach((button) => button.addEventListener('click', () => {
  mainTrendMode = button.dataset.trendMode;
  mainTrendTabs.forEach((item) => {
    const selected = item === button;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-pressed', String(selected));
  });
  renderMainTrend();
}));

mainTrendChart.addEventListener('mousemove', (event) => {
  const bounds = mainTrendChart.getBoundingClientRect();
  const viewX = (event.clientX - bounds.left) / bounds.width * 1000;
  const nearest = mainTrendPoints.reduce((best, point, index) => Math.abs(point.x - viewX) < Math.abs(best.point.x - viewX) ? { point, index } : best, { point: mainTrendPoints[0], index: 0 });
  const hoverGroup = mainTrendSvg.querySelector('#main-trend-hover');
  hoverGroup.setAttribute('visibility', 'visible');
  const maxValue = Math.max(1, ...mainTrendPoints.flatMap(({ row }) => mainTrendSeries.map((series) => Number(row[series.key]) || 0)));
  hoverGroup.querySelector('line').setAttribute('x1', nearest.point.x);
  hoverGroup.querySelector('line').setAttribute('x2', nearest.point.x);
  hoverGroup.querySelectorAll('circle').forEach((circle, index) => {
    const series = mainTrendSeries[index];
    circle.setAttribute('cx', nearest.point.x);
    circle.setAttribute('cy', 170 - ((Number(nearest.point.row[series.key]) || 0) / maxValue) * 154);
  });
  mainTrendTooltip.innerHTML = `<strong>${nearest.point.row.time}</strong>${mainTrendSeries.map((series) => `<span>${series.label}：${series.format(nearest.point.row[series.key])}</span>`).join('')}`;
  mainTrendTooltip.hidden = false;
  const tooltipLeft = Math.min(Math.max(8, event.clientX - bounds.left + 14), bounds.width - mainTrendTooltip.offsetWidth - 8);
  const tooltipTop = Math.min(Math.max(8, event.clientY - bounds.top - 12), bounds.height - mainTrendTooltip.offsetHeight - 8);
  mainTrendTooltip.style.left = `${tooltipLeft}px`;
  mainTrendTooltip.style.top = `${tooltipTop}px`;
});

mainTrendChart.addEventListener('mouseleave', () => {
  mainTrendTooltip.hidden = true;
  const hoverGroup = mainTrendSvg.querySelector('#main-trend-hover');
  if (hoverGroup) hoverGroup.setAttribute('visibility', 'hidden');
});

renderMainTrend();

const columnGroups = [
  {
    name: '投放参数',
    fields: [
      '投放号', '每日消耗预算', '优先提升目标', '加热方式', '出价/目标ROI', '加热素材',
      '计划分组', '数据更新时间', '计划终止时间', '创建时间', '计划加热时长'
    ]
  },
  {
    name: '投放消耗',
    fields: ['投放金额/消耗进度', '总消耗金额', '今日消耗']
  },
  {
    name: '互动效果',
    fields: [
      '短视频评论次数', '总评论次数', '新增关注数', '总点赞次数', '直播间点赞次数', '短视频点赞次数',
      '直播间新增粉丝数', '短视频新增粉丝数', '直播间评论次数'
    ]
  },
  {
    name: '加热数据',
    fields: [
      '总成交ROI', '总成交金额', '总成交订单数', '总曝光人数', '商品点击次数', '商品点击率',
      '点击成交率', '千展费用', '点击成本', '转化成本', '进入成本', '商品点击人数',
      '当场下单订单数', '当场下单 ROI', '下单人数', '成交人数', '利润', '进入率',
      '直播间曝光人数', '短视频曝光总人数', '总进入人数', '进入直播间人数',
      '短视频进入人数', 'GPM', '下单成本', '直播间观看人次', '短视频观看人次'
    ]
  },
  {
    name: '长周期转化',
    fields: []
  }
];

// 列表和字段定义弹窗统一采用已确认的长期计划最终字段顺序。
const businessColumns = [
  '投放号', '投放金额/消耗进度', '每日消耗预算', '优先提升目标', '加热方式', '出价/目标ROI', '加热素材', '计划分组',
  '数据更新时间', '计划终止时间', '创建时间', '计划加热时长', '总消耗金额', '今日消耗',
  '短视频评论次数', '总评论次数', '新增关注数', '总点赞次数', '直播间点赞次数', '短视频点赞次数',
  '直播间新增粉丝数', '短视频新增粉丝数', '直播间评论次数', '总成交ROI', '总成交金额', '总成交订单数',
  '总曝光人数', '商品点击次数', '商品点击率', '点击成交率', '千展费用', '点击成本', '转化成本', '进入成本',
  '商品点击人数', '当场下单订单数', '当场下单 ROI', '下单人数', '成交人数', '利润', '进入率', '直播间曝光人数',
  '短视频曝光总人数', '总进入人数', '进入直播间人数', '短视频进入人数', 'GPM', '下单成本', '直播间观看人次', '短视频观看人次'
];

const planRows = [
  { name: '测试支付码', id: '1783612800_1096390', targetAccount: 'tel小小店非正式账号', amount: '2000', todaySpend: '126.50', endTime: '2026-07-14 09:44:52', createdTime: '2026-07-13 17:49:14', deliveryState: 'unauthorized' },
  { name: '产品测试，花光所有的豆...', id: '1783526400_1862699', targetAccount: 'tel小小店非正式账号', amount: '1000', todaySpend: '83.20', endTime: '2026-07-13 17:24:55', createdTime: '2026-07-13 17:05:29', deliveryState: 'pending' },
  { name: '产品测试，花光所有的豆...', id: '1783440000_1765763', targetAccount: 'tel小小店非正式账号', amount: '1000', todaySpend: '0', endTime: '2026-07-13 17:04:18', createdTime: '2026-07-13 17:02:37', deliveryState: 'active' },
  { name: '[7.6复投]主力计划0703-6...', id: '1783440000_1703702', targetAccount: 'tel小小店非正式账号', amount: '200', todaySpend: '35.80', endTime: '2026-07-13 16:45:32', createdTime: '2026-07-13 16:40:18', deliveryState: 'active' },
  { name: '202607071859微信豆计...', id: '1783353600_1680459', targetAccount: 'tel小小店非正式账号', amount: '2000', todaySpend: '210.00', endTime: '2026-07-13 16:18:46', createdTime: '2026-07-13 16:12:09', deliveryState: 'active' }
];

const percentFields = new Set(['商品点击率', '点击成交率', '进入率']);
const amountFields = new Set([
  '每日消耗预算', '总消耗金额', '今日消耗', '总成交金额', '千展费用',
  '点击成本', '转化成本', '进入成本', '利润', 'GPM', '下单成本'
]);
const numberFields = new Set([
  '每日消耗预算', '总消耗金额', '今日消耗', '总成交ROI', '总成交金额', '总成交订单数', '总曝光人数', '总评论次数', '短视频评论次数', '新增关注数',
  '商品点击次数', '千展费用', '点击成本', '转化成本', '进入成本', '商品点击人数', '当场下单订单数', '当场下单 ROI',
  '下单人数', '成交人数', '利润', '直播间曝光人数', '短视频曝光总人数', '总点赞次数', '直播间点赞次数',
  '短视频点赞次数', '直播间新增粉丝数', '短视频新增粉丝数', '直播间评论次数', '总进入人数',
  '进入直播间人数', '短视频进入人数', 'GPM', '下单成本', '直播间观看人次', '短视频观看人次'
]);

let selectedColumnOrder = [...businessColumns];
let draftColumnOrder = [...businessColumns];
const tableHead = document.querySelector('#plan-table-head');
const tableBody = document.querySelector('#plan-table-body');
const batchActions = document.querySelector('#batch-actions');
const settingsButton = document.querySelector('#column-settings-button');
const settingsPanel = document.querySelector('#column-settings-panel');
const settingsList = document.querySelector('#column-settings-list');
const selectedColumnList = document.querySelector('#selected-column-list');
const selectedColumnPanelCount = document.querySelector('#selected-column-panel-count');
const resetSelectedColumnsButton = document.querySelector('#reset-selected-columns');
const clearSelectedColumnsButton = document.querySelector('#clear-selected-columns');
const groupSelectAllCheckbox = document.querySelector('#column-group-select-all');
const searchInput = document.querySelector('#column-search-input');
const categoryList = document.querySelector('#picker-category-list');
const sectionTitleText = document.querySelector('#picker-section-title-text');
const cancelSettingsButton = document.querySelector('#column-settings-cancel');
const confirmSettingsButton = document.querySelector('#column-settings-confirm');
const legacyPaymentLayer = document.querySelector('#legacy-payment-layer');
const closeLegacyPaymentButton = document.querySelector('#close-legacy-payment');
const legacyPaymentPlanName = document.querySelector('#legacy-payment-plan-name');
const legacyPaymentAccount = document.querySelector('#legacy-payment-account');
const statusConfirmLayer = document.querySelector('#status-confirm-layer');
const statusConfirmTitle = document.querySelector('#status-confirm-title');
const statusConfirmMessage = document.querySelector('#status-confirm-message');
const closeStatusConfirmButton = document.querySelector('#close-status-confirm');
const cancelStatusConfirmButton = document.querySelector('#cancel-status-confirm');
const confirmStatusChangeButton = document.querySelector('#confirm-status-change');
const selectedPlanIds = new Set();
let activeColumnGroup = columnGroups[0].name;
let pendingStatusChange = null;

function getFieldValue(field, row) {
  if (field === '每日消耗预算') return '100.00';
  if (field === '今日消耗') return Number(row.todaySpend).toFixed(2);
  if (field === '优先提升目标') return '直播间涨粉';
  if (field === '加热方式') return '放量加热';
  if (field === '出价/目标ROI') return '￥0.00';
  if (field === '加热素材') return '直播间';
  if (field === '计划分组') return '长期计划包-测试';
  if (field === '数据更新时间') return '--';
  if (field === '计划终止时间') return row.endTime;
  if (field === '创建时间') return row.createdTime;
  if (amountFields.has(field)) return '0.00';
  if (percentFields.has(field)) return '0.00%';
  if (numberFields.has(field)) return field.includes('ROI') ? '0.00' : '0';
  return '-';
}

function renderBusinessCell(field, row) {
  if (field === '投放号') {
    return '<div>畅移小店</div><div class="online"><span></span>在线</div>';
  }
  if (field === '投放金额/消耗进度') {
    const amountText = Number(row.amount).toFixed(2);
    const progressValue = Math.min(100, Math.max(0, row.amount ? (Number(row.todaySpend) / Number(row.amount)) * 100 : 0));
    const progressText = `${progressValue.toFixed(2)}%`;
    return `<div class="amount-value">￥${amountText}</div><div class="spend-progress"><span class="spend-progress-track"><i style="width: ${progressValue}%"></i></span><span>${progressText}</span></div>`;
  }
  if (field === '计划加热时长') return '18天';
  return getFieldValue(field, row);
}

function getDeliveryStateText(state) {
  if (state === 'unauthorized') return '未授权代扣';
  if (state === 'pending') return '待启动';
  if (state === 'reviewing') return '审核中';
  if (state === 'paused') return '已暂停';
  if (state === 'closed') return '已完成';
  return '加热中';
}

function getDeliveryActionText(state) {
  if (state === 'paused') return '恢复';
  return '暂停';
}

function renderRowActions(row, rowIndex) {
  if (row.deliveryState === 'unauthorized') {
    return `<div class="row-actions"><button class="row-action-button" type="button" data-open-payment="${rowIndex}">支付</button>&nbsp; <button class="row-action-button" type="button" data-open-drawer="${rowIndex}">数据</button>&nbsp; <button class="row-action-button" type="button" data-close-delivery="${rowIndex}">终止</button>&nbsp; <button class="row-action-button" type="button" data-redeliver="${rowIndex}">复投</button></div>`;
  }
  const dataAction = `<button class="row-action-button" type="button" data-open-drawer="${rowIndex}">数据</button>`;
  const redeliverAction = `<button class="row-action-button" type="button" data-redeliver="${rowIndex}">复投</button>`;
  if (row.deliveryState === 'paused') {
    return `<div class="row-actions">${dataAction}&nbsp; <button class="row-action-button" type="button" data-toggle-status="${rowIndex}">恢复</button>&nbsp; ${redeliverAction}</div>`;
  }
  if (row.deliveryState === 'active' || row.deliveryState === 'pending') {
    return `<div class="row-actions">${dataAction}&nbsp; <button class="row-action-button" type="button" data-close-delivery="${rowIndex}">终止</button>&nbsp; <button class="row-action-button" type="button" data-toggle-status="${rowIndex}">暂停</button>&nbsp; ${redeliverAction}</div>`;
  }
  return `<div class="row-actions">${dataAction}&nbsp; ${redeliverAction}</div>`;
}

function renderTable() {
  const visibleColumns = selectedColumnOrder;
  const visibleRows = planRows.map((row, rowIndex) => ({ row, rowIndex }))
    .filter(({ row }) => !planStatusFilter.value || row.deliveryState === planStatusFilter.value);
  const allRowsSelected = planRows.length > 0 && selectedPlanIds.size === planRows.length;
  const someRowsSelected = selectedPlanIds.size > 0 && !allRowsSelected;
  tableHead.innerHTML = `
    <th class="check-column"><button class="checkbox${allRowsSelected ? ' is-selected' : ''}${someRowsSelected ? ' is-indeterminate' : ''}" type="button" data-select-all role="checkbox" aria-checked="${someRowsSelected ? 'mixed' : String(allRowsSelected)}" aria-label="${allRowsSelected ? '取消全选' : '全选'}"></button></th>
    <th class="plan-column">计划名称/ID</th>
    <th class="target-account-column">被投号</th>
    <th class="status-column">状态/操作</th>
    ${visibleColumns.map((field) => `<th class="business-column" data-field="${field}">${field}</th>`).join('')}
  `;

  tableBody.innerHTML = visibleRows.map(({ row, rowIndex }) => `
    <tr class="${selectedPlanIds.has(row.id) ? 'is-selected' : ''}">
      <td><button class="checkbox${selectedPlanIds.has(row.id) ? ' is-selected' : ''}" type="button" data-select-row="${row.id}" role="checkbox" aria-checked="${String(selectedPlanIds.has(row.id))}" aria-label="选择计划${row.name}"></button></td>
      <td><div class="plan-name">${row.name}</div><div class="plan-id">ID: ${row.id}</div></td>
      <td><div class="target-account"><span class="target-account-avatar">豆</span><span>${row.targetAccount}</span></div></td>
      <td><span class="status-tag status-tag-${row.deliveryState}">${getDeliveryStateText(row.deliveryState)}</span>${renderRowActions(row, rowIndex)}</td>
      ${visibleColumns.map((field) => `<td class="business-column" data-field="${field}">${renderBusinessCell(field, row)}</td>`).join('')}
    </tr>
  `).join('');
  batchActions.hidden = selectedPlanIds.size === 0;
}

planStatusFilter.addEventListener('change', renderTable);
longTermFilterReset.addEventListener('click', () => {
  planStatusFilter.value = '';
  renderTable();
});

function renderColumnSettings(query = '') {
  const normalizedQuery = query.trim().toLowerCase();
  const activeGroup = columnGroups.find((group) => group.name === activeColumnGroup);
  const candidateFields = normalizedQuery ? businessColumns : (activeGroup?.fields || []);
  const visibleFields = candidateFields
    .filter((field) => field.toLowerCase().includes(normalizedQuery))
  sectionTitleText.textContent = normalizedQuery ? '搜索结果' : activeColumnGroup;
  groupSelectAllCheckbox.hidden = Boolean(normalizedQuery);
  if (!normalizedQuery) {
    const groupFields = activeGroup?.fields || [];
    const selectedGroupFieldCount = groupFields.filter((field) => draftColumnOrder.includes(field)).length;
    groupSelectAllCheckbox.checked = groupFields.length > 0 && selectedGroupFieldCount === groupFields.length;
    groupSelectAllCheckbox.indeterminate =
      selectedGroupFieldCount > 0 && selectedGroupFieldCount < groupFields.length;
    groupSelectAllCheckbox.disabled = groupFields.length === 0;
    groupSelectAllCheckbox.setAttribute('aria-label', `全选${activeColumnGroup}分类字段`);
  }
  settingsList.innerHTML = visibleFields.length ? visibleFields.map((field) => `
      <label class="column-setting-item">
        <input type="checkbox" value="${field}" ${draftColumnOrder.includes(field) ? 'checked' : ''}>
        <span>${field}</span>
      </label>
    `).join('') : `<div class="column-settings-empty">${normalizedQuery ? '暂无匹配字段' : '暂无字段'}</div>`;
}

function renderColumnCategories() {
  categoryList.innerHTML = columnGroups.map((group) => `
    <button class="picker-category-item${group.name === activeColumnGroup ? ' active' : ''}"
      type="button" data-column-group="${group.name}">${group.name}</button>
  `).join('');
}

function renderSelectedColumns() {
  selectedColumnList.innerHTML = draftColumnOrder.length ? draftColumnOrder.map((field) => `
    <div class="selected-column-item" draggable="true" data-field="${field}">
      <span class="drag-handle">≡</span>
      <span class="selected-column-name">${field}</span>
      <button class="remove-column-button" type="button" data-remove-field="${field}" aria-label="移除${field}">×</button>
    </div>
  `).join('') : `
    <div class="selected-column-empty">
      <span>暂无已选字段</span>
      <p>请从左侧勾选需要展示的字段</p>
    </div>
  `;
  selectedColumnPanelCount.textContent = String(draftColumnOrder.length);
  resetSelectedColumnsButton.disabled =
    draftColumnOrder.length === businessColumns.length
    && draftColumnOrder.every((field, index) => field === businessColumns[index]);
  clearSelectedColumnsButton.disabled = draftColumnOrder.length === 0;
}

function refreshSettings() {
  renderColumnCategories();
  renderColumnSettings(searchInput.value);
  renderSelectedColumns();
}

function closeSettings() {
  settingsPanel.hidden = true;
  settingsButton.setAttribute('aria-expanded', 'false');
}

settingsList.addEventListener('change', (event) => {
  const checkbox = event.target;
  if (!(checkbox instanceof HTMLInputElement)) return;
  if (checkbox.checked && !draftColumnOrder.includes(checkbox.value)) draftColumnOrder.push(checkbox.value);
  if (!checkbox.checked) draftColumnOrder = draftColumnOrder.filter((field) => field !== checkbox.value);
  refreshSettings();
});

groupSelectAllCheckbox.addEventListener('change', () => {
  const activeGroup = columnGroups.find((group) => group.name === activeColumnGroup);
  const groupFields = activeGroup?.fields || [];
  if (groupSelectAllCheckbox.checked) {
    groupFields.forEach((field) => {
      if (!draftColumnOrder.includes(field)) draftColumnOrder.push(field);
    });
  } else {
    draftColumnOrder = draftColumnOrder.filter((field) => !groupFields.includes(field));
  }
  refreshSettings();
});

clearSelectedColumnsButton.addEventListener('click', () => {
  if (draftColumnOrder.length === 0) return;
  draftColumnOrder = [];
  refreshSettings();
});

resetSelectedColumnsButton.addEventListener('click', () => {
  const isDefaultConfiguration =
    draftColumnOrder.length === businessColumns.length
    && draftColumnOrder.every((field, index) => field === businessColumns[index]);
  if (isDefaultConfiguration) return;
  draftColumnOrder = [...businessColumns];
  refreshSettings();
});

searchInput.addEventListener('input', () => renderColumnSettings(searchInput.value));

categoryList.addEventListener('click', (event) => {
  const categoryButton = event.target.closest('[data-column-group]');
  if (!categoryButton) return;
  activeColumnGroup = categoryButton.dataset.columnGroup;
  renderColumnCategories();
  renderColumnSettings(searchInput.value);
});

selectedColumnList.addEventListener('click', (event) => {
  const removeButton = event.target.closest('[data-remove-field]');
  if (!removeButton) return;
  draftColumnOrder = draftColumnOrder.filter((field) => field !== removeButton.dataset.removeField);
  refreshSettings();
});

selectedColumnList.addEventListener('dragstart', (event) => {
  const item = event.target.closest('.selected-column-item');
  if (!item) return;
  item.classList.add('dragging');
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', item.dataset.field);
});

selectedColumnList.addEventListener('dragend', (event) => {
  const item = event.target.closest('.selected-column-item');
  if (item) item.classList.remove('dragging');
});

selectedColumnList.addEventListener('dragover', (event) => event.preventDefault());

selectedColumnList.addEventListener('drop', (event) => {
  event.preventDefault();
  const targetItem = event.target.closest('.selected-column-item');
  const draggedField = event.dataTransfer.getData('text/plain');
  if (!targetItem || !draggedField || targetItem.dataset.field === draggedField) return;
  const reordered = draftColumnOrder.filter((field) => field !== draggedField);
  const targetIndex = reordered.indexOf(targetItem.dataset.field);
  reordered.splice(targetIndex, 0, draggedField);
  draftColumnOrder = reordered;
  renderSelectedColumns();
});

settingsButton.addEventListener('click', () => {
  draftColumnOrder = [...selectedColumnOrder];
  activeColumnGroup = columnGroups[0].name;
  searchInput.value = '';
  refreshSettings();
  settingsPanel.hidden = false;
  settingsButton.setAttribute('aria-expanded', 'true');
});

cancelSettingsButton.addEventListener('click', closeSettings);

confirmSettingsButton.addEventListener('click', () => {
  selectedColumnOrder = [...draftColumnOrder];
  renderTable();
  closeSettings();
});

tableHead.addEventListener('click', (event) => {
  const selectAllButton = event.target.closest('[data-select-all]');
  if (!selectAllButton) return;
  if (selectedPlanIds.size === planRows.length) {
    selectedPlanIds.clear();
  } else {
    planRows.forEach((row) => selectedPlanIds.add(row.id));
  }
  renderTable();
});

batchActions.addEventListener('click', (event) => {
  const actionButton = event.target.closest('[data-batch-action]');
  if (!actionButton) return;
  const nextState = actionButton.dataset.batchAction;
  planRows.forEach((row) => {
    if (!selectedPlanIds.has(row.id)) return;
    if (row.deliveryState === 'closed' && nextState !== 'closed') return;
    row.deliveryState = nextState;
  });
  if (nextState === 'closed') selectedPlanIds.clear();
  renderTable();
});

renderTable();

const dataDrawerLayer = document.querySelector('#data-drawer-layer');
const dataDrawerBack = document.querySelector('#data-drawer-back');
const drawerTabs = document.querySelectorAll('.drawer-tab');
const drawerPanels = document.querySelectorAll('.drawer-panel');
const drawerScrollArea = document.querySelector('.drawer-scroll-area');
const drawerPlanName = document.querySelector('#drawer-plan-name');
const drawerPlanId = document.querySelector('#drawer-plan-id');
const drawerPlanAmount = document.querySelector('#drawer-plan-amount');
const stageMetricPicker = document.querySelector('#stage-metric-picker');
const stageMetricOptions = document.querySelector('#stage-metric-options');
const stageChartLegend = document.querySelector('#stage-chart-legend');
const stageTrendChart = document.querySelector('#stage-trend-chart');
const stageChartCard = document.querySelector('.stage-chart-card');
const stageChartTooltip = document.querySelector('#stage-chart-tooltip');
const stageDetailTableBody = document.querySelector('#stage-detail-table-body');
const stageDetailTableHead = document.querySelector('#stage-detail-table-head');
const stageDetailTitle = document.querySelector('#stage-detail-title');
const effectDetailTableHead = document.querySelector('#effect-detail-table-head');
const effectDetailTableBody = document.querySelector('#effect-detail-table-body');
const stageTimeDimension = document.querySelector('#stage-time-dimension');
const stageDatePicker = document.querySelector('#stage-date-picker');
const stageDateTrigger = document.querySelector('#stage-date-trigger');
const stageDateStartLabel = document.querySelector('#stage-date-start-label');
const stageDateEndLabel = document.querySelector('#stage-date-end-label');
const stageDatePanel = document.querySelector('#stage-date-panel');
const stageCalendarJuly = document.querySelector('#stage-calendar-july');
const stageCalendarAugust = document.querySelector('#stage-calendar-august');
const stageCalendarStartDate = document.querySelector('#stage-calendar-start-date');
const stageCalendarEndDate = document.querySelector('#stage-calendar-end-date');
const stageDateConfirm = document.querySelector('#stage-date-confirm');
const stageTotalSpend = document.querySelector('#stage-total-spend');
const stageTotalOrderAmount = document.querySelector('#stage-total-order-amount');
const stageTotalOrders = document.querySelector('#stage-total-orders');
const stageTotalRoi = document.querySelector('#stage-total-roi');
const stageTotalEntries = document.querySelector('#stage-total-entries');
const stageTotalClickUsers = document.querySelector('#stage-total-click-users');
const selectedStageMetrics = new Set([
  'spend', 'exposure', 'views', 'actualEntries', 'clickUsers',
  'clicks', 'clickCost', 'orders', 'orderAmount', 'roi'
]);
let stageDateStart = '2026-07-13';
let stageDateEnd = '2026-07-17';
let draftStageDateStart = stageDateStart;
let draftStageDateEnd = stageDateEnd;
let stageTimeMode = 'day';
const stageDetailSortState = {
  day: { key: null, direction: 'asc' },
  hour: { key: null, direction: 'asc' }
};

const stageMetricDefinitions = {
  spend: { label: '消耗金额', color: '#1769ff', format: 'money' },
  stageGmv: { label: '阶段GMV', color: '#ff9f43', format: 'money' },
  exposure: { label: '曝光数', color: '#7b61ff', format: 'integer' },
  views: { label: '观看数', color: '#18a0a8', format: 'integer' },
  actualEntries: { label: '实际进入人数', color: '#ff7a45', format: 'integer' },
  clickUsers: { label: '商品点击人数', color: '#e455c4', format: 'integer' },
  clicks: { label: '商品点击次数', color: '#9a60d1', format: 'integer' },
  comments: { label: '评论次数', color: '#7bc043', format: 'integer' },
  clickCost: { label: '商品点击成本', color: '#00a870', format: 'money' },
  orders: { label: '下单订单数', color: '#f5a623', format: 'integer' },
  dealOrders: { label: '成交订单数', color: '#e55353', format: 'integer' },
  orderAmount: { label: '成交订单金额', color: '#e95065', format: 'money' },
  roi: { label: '成交ROI', color: '#4f6bdc', format: 'decimal' }
};

const stageDailyData = [
  { date: '2026-07-11', spend: 96.80, stageGmv: 498.00, exposure: 6920, views: 3380, actualEntries: 1048, clickUsers: 221, clicks: 294, comments: 96, clickCost: 0.33, orders: 6, dealOrders: 4, orderAmount: 432.00, roi: 4.46 },
  { date: '2026-07-12', spend: 112.40, stageGmv: 572.00, exposure: 7540, views: 3690, actualEntries: 1165, clickUsers: 248, clicks: 318, comments: 112, clickCost: 0.35, orders: 7, dealOrders: 5, orderAmount: 496.00, roi: 4.41 },
  { date: '2026-07-13', spend: 126.50, stageGmv: 655.00, exposure: 8650, views: 4210, actualEntries: 1320, clickUsers: 286, clicks: 362, comments: 128, clickCost: 0.44, orders: 8, dealOrders: 6, orderAmount: 568.00, roi: 4.49 },
  { date: '2026-07-14', spend: 188.20, stageGmv: 845.00, exposure: 11240, views: 5320, actualEntries: 1680, clickUsers: 340, clicks: 436, comments: 169, clickCost: 0.55, orders: 10, dealOrders: 8, orderAmount: 720.00, roi: 3.83 },
  { date: '2026-07-15', spend: 236.80, stageGmv: 1125.00, exposure: 13980, views: 6890, actualEntries: 2120, clickUsers: 428, clicks: 552, comments: 205, clickCost: 0.55, orders: 13, dealOrders: 11, orderAmount: 960.00, roi: 4.05 },
  { date: '2026-07-16', spend: 315.40, stageGmv: 1490.00, exposure: 16820, views: 8120, actualEntries: 2490, clickUsers: 512, clicks: 671, comments: 254, clickCost: 0.62, orders: 17, dealOrders: 14, orderAmount: 1280.00, roi: 4.06 },
  { date: '2026-07-17', spend: 402.60, stageGmv: 1845.00, exposure: 19750, views: 9460, actualEntries: 2910, clickUsers: 603, clicks: 790, comments: 318, clickCost: 0.67, orders: 21, dealOrders: 18, orderAmount: 1590.00, roi: 3.95 }
];

function parseStageDate(dateText) {
  return new Date(`${dateText}T00:00:00`);
}

function formatStageDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function shiftStageDate(dateText, offset) {
  const date = parseStageDate(dateText);
  date.setDate(date.getDate() + offset);
  return formatStageDate(date);
}

function getStageDateRangeDays(startDate, endDate) {
  return Math.floor((parseStageDate(endDate) - parseStageDate(startDate)) / 86400000) + 1;
}

function renderStageCalendarMonth(container, year, month) {
  const firstDay = new Date(year, month, 1);
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  const firstCell = new Date(year, month, 1 - mondayOffset);
  container.innerHTML = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(firstCell);
    date.setDate(firstCell.getDate() + index);
    const dateText = formatStageDate(date);
    const classes = [];
    const exceedsMaximum = !draftStageDateEnd && Math.abs(parseStageDate(dateText) - parseStageDate(draftStageDateStart)) / 86400000 > 6;
    if (date.getMonth() !== month) classes.push('is-muted');
    if (exceedsMaximum) classes.push('is-disabled-range');
    if (draftStageDateEnd && dateText > draftStageDateStart && dateText < draftStageDateEnd) classes.push('is-in-range');
    if (dateText === draftStageDateStart || dateText === draftStageDateEnd) classes.push('is-selected');
    return `<button class="${classes.join(' ')}" type="button" data-stage-date="${dateText}" ${exceedsMaximum ? 'disabled' : ''}>${date.getDate()}</button>`;
  }).join('');
}

function renderStageCalendars() {
  renderStageCalendarMonth(stageCalendarJuly, 2026, 6);
  renderStageCalendarMonth(stageCalendarAugust, 2026, 7);
  stageCalendarStartDate.textContent = draftStageDateStart;
  stageCalendarEndDate.textContent = draftStageDateEnd || draftStageDateStart;
}

function setDraftStageRange(startDate, endDate) {
  draftStageDateStart = startDate;
  draftStageDateEnd = endDate;
  renderStageCalendars();
}

function getVisibleStageDailyData() {
  return stageDailyData.filter((row) => row.date >= stageDateStart && row.date <= stageDateEnd);
}

const stageHourlyWeights = [0.018, 0.012, 0.009, 0.008, 0.008, 0.012, 0.022, 0.035, 0.048, 0.058, 0.072, 0.082, 0.064, 0.045, 0.038, 0.035, 0.032, 0.036, 0.052, 0.072, 0.088, 0.092, 0.062, 0.040];
const stageHourlyWeightTotal = stageHourlyWeights.reduce((sum, weight) => sum + weight, 0);

function getVisibleStageHourlyData() {
  const integerMetrics = new Set(['exposure', 'views', 'actualEntries', 'clickUsers', 'clicks', 'comments', 'orders', 'dealOrders']);
  return getVisibleStageDailyData().flatMap((dailyRow, dayIndex) => stageHourlyWeights.map((weight, hour) => {
    const ratio = weight / stageHourlyWeightTotal;
    const variation = 0.88 + ((hour * 7 + dayIndex * 3) % 9) * 0.03;
    const row = {
      date: dailyRow.date,
      hour,
      period: `${String(hour).padStart(2, '0')}:00~${String(hour).padStart(2, '0')}:59`
    };
    ['spend', 'stageGmv', 'exposure', 'views', 'actualEntries', 'clickUsers', 'clicks', 'comments', 'orders', 'dealOrders', 'orderAmount'].forEach((metricKey) => {
      const value = dailyRow[metricKey] * ratio * variation;
      row[metricKey] = integerMetrics.has(metricKey) ? Math.round(value) : Number(value.toFixed(2));
    });
    row.clickCost = row.clicks ? Number((row.spend / row.clicks).toFixed(2)) : 0;
    row.roi = row.spend ? Number((row.orderAmount / row.spend).toFixed(2)) : 0;
    return row;
  }));
}

function getVisibleStageData() {
  return stageTimeMode === 'hour' ? getVisibleStageHourlyData() : getVisibleStageDailyData();
}

function formatStageMetric(metricKey, value) {
  const definition = stageMetricDefinitions[metricKey];
  if (definition.format === 'money') return `￥${Number(value).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (definition.format === 'decimal') return Number(value).toFixed(2);
  return Math.round(Number(value)).toLocaleString('zh-CN');
}

function createSmoothStagePath(points) {
  if (!points.length) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let index = 0; index < points.length - 1; index += 1) {
    const previous = points[index - 1] || points[index];
    const current = points[index];
    const next = points[index + 1];
    const afterNext = points[index + 2] || next;
    const control1X = current.x + (next.x - previous.x) / 6;
    const control1Y = current.y + (next.y - previous.y) / 6;
    const control2X = next.x - (afterNext.x - current.x) / 6;
    const control2Y = next.y - (afterNext.y - current.y) / 6;
    path += ` C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${next.x} ${next.y}`;
  }
  return path;
}

function renderStageTrendChart() {
  const metricKeys = [...selectedStageMetrics];
  const visibleRows = getVisibleStageData();
  stageChartTooltip.hidden = true;
  stageMetricOptions.querySelectorAll('[data-stage-metric]').forEach((button) => {
    const selected = selectedStageMetrics.has(button.dataset.stageMetric);
    button.classList.toggle('is-selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  if (!visibleRows.length) {
    stageChartLegend.innerHTML = '';
    stageTrendChart.innerHTML = '<text x="410" y="118" text-anchor="middle" fill="#a2abb8" font-size="12">暂无数据</text>';
    return;
  }

  stageChartLegend.innerHTML = metricKeys.map((metricKey) => {
    const definition = stageMetricDefinitions[metricKey];
    return `<span><i style="background:${definition.color}"></i>${definition.label}</span>`;
  }).join('');

  const chartWidth = 820;
  const chartHeight = 230;
  const left = 42;
  const right = 16;
  const top = 18;
  const bottom = 34;
  const plotWidth = chartWidth - left - right;
  const plotHeight = chartHeight - top - bottom;
  const gridLines = Array.from({ length: 5 }, (_, index) => {
    const y = top + (plotHeight / 4) * index;
    return `<line class="stage-chart-grid" x1="${left}" y1="${y}" x2="${chartWidth - right}" y2="${y}"></line>`;
  }).join('');
  const labelStep = stageTimeMode === 'hour'
    ? Math.max(6, Math.ceil(visibleRows.length / 8))
    : (visibleRows.length <= 10 ? 1 : 3);
  const dateLabels = visibleRows.map((row, index) => {
    if (index % labelStep !== 0 && index !== visibleRows.length - 1) return '';
    const x = visibleRows.length === 1 ? left + plotWidth / 2 : left + (plotWidth / (visibleRows.length - 1)) * index;
    const label = stageTimeMode === 'hour' ? `${row.date.slice(5)} ${String(row.hour).padStart(2, '0')}:00` : row.date.slice(5);
    return `<text class="stage-chart-date" x="${x}" y="${chartHeight - 10}">${label}</text>`;
  }).join('');
  const metricLines = metricKeys.map((metricKey) => {
    const definition = stageMetricDefinitions[metricKey];
    const values = visibleRows.map((row) => row[metricKey]);
    const maximum = Math.max(...values) || 1;
    const points = values.map((value, index) => {
      const x = values.length === 1 ? left + plotWidth / 2 : left + (plotWidth / (values.length - 1)) * index;
      const y = top + plotHeight - (value / maximum) * (plotHeight - 12);
      return { x, y, value, date: visibleRows[index].date };
    });
    return `<path class="stage-chart-line" stroke="${definition.color}" d="${createSmoothStagePath(points)}"></path>`;
  }).join('');

  stageTrendChart.innerHTML = `${gridLines}<line class="stage-chart-axis" x1="${left}" y1="${top + plotHeight}" x2="${chartWidth - right}" y2="${top + plotHeight}"></line>${dateLabels}${metricLines}`;
}

function renderStageDetailTable() {
  const fieldOrder = ['spend', 'exposure', 'views', 'actualEntries', 'clickUsers', 'clicks', 'clickCost', 'orders', 'orderAmount', 'roi'];
  const sortState = stageDetailSortState[stageTimeMode];
  const visibleRows = [...getVisibleStageData()];
  if (sortState.key) {
    visibleRows.sort((firstRow, secondRow) => {
      let firstValue = sortState.key === 'period' ? firstRow.hour : firstRow[sortState.key];
      let secondValue = sortState.key === 'period' ? secondRow.hour : secondRow[sortState.key];
      if (sortState.key === 'date') {
        firstValue = firstRow.date;
        secondValue = secondRow.date;
      }
      const result = typeof firstValue === 'string'
        ? firstValue.localeCompare(secondValue)
        : Number(firstValue) - Number(secondValue);
      return sortState.direction === 'asc' ? result : -result;
    });
  }
  const renderSortableHeader = (label, key) => {
    const isActive = sortState.key === key;
    const ariaSort = isActive ? (sortState.direction === 'asc' ? 'ascending' : 'descending') : 'none';
    const stateClass = isActive ? ` is-active is-${sortState.direction}` : '';
    return `<th aria-sort="${ariaSort}"><button class="stage-sort-button${stateClass}" type="button" data-stage-sort="${key}">${label}<span aria-hidden="true"></span></button></th>`;
  };
  const metricHeaders = fieldOrder.map((metricKey) => renderSortableHeader(stageMetricDefinitions[metricKey].label, metricKey)).join('');
  stageDetailTitle.textContent = stageTimeMode === 'hour' ? '分时数据明细' : '每日数据明细';
  stageDetailTableHead.innerHTML = `${renderSortableHeader('统计日期', 'date')}${stageTimeMode === 'hour' ? renderSortableHeader('时段', 'period') : ''}${metricHeaders}`;
  stageDetailTableBody.innerHTML = visibleRows.length ? visibleRows.map((row) => `
    <tr><td>${row.date}</td>${stageTimeMode === 'hour' ? `<td>${row.period}</td>` : ''}${fieldOrder.map((metricKey) => `<td>${formatStageMetric(metricKey, row[metricKey])}</td>`).join('')}</tr>
  `).join('') : `<tr><td colspan="${stageTimeMode === 'hour' ? 12 : 11}" style="text-align:center;color:#a2abb8">暂无数据</td></tr>`;
}

function renderStageSummary() {
  const visibleRows = getVisibleStageDailyData();
  const total = (field) => visibleRows.reduce((sum, row) => sum + row[field], 0);
  const spend = total('spend');
  const orderAmount = total('orderAmount');
  stageTotalSpend.textContent = formatStageMetric('spend', spend);
  stageTotalOrderAmount.textContent = formatStageMetric('orderAmount', orderAmount);
  stageTotalOrders.textContent = total('orders').toLocaleString('zh-CN');
  stageTotalRoi.textContent = spend ? (orderAmount / spend).toFixed(2) : '0.00';
  stageTotalEntries.textContent = total('actualEntries').toLocaleString('zh-CN');
  stageTotalClickUsers.textContent = total('clickUsers').toLocaleString('zh-CN');
}

function renderStageData() {
  renderStageSummary();
  renderStageTrendChart();
  renderStageDetailTable();
}

renderStageCalendars();

stageDateTrigger.addEventListener('click', () => {
  const willOpen = stageDatePanel.hidden;
  if (willOpen) {
    draftStageDateStart = stageDateStart;
    draftStageDateEnd = stageDateEnd;
    renderStageCalendars();
  }
  stageDatePanel.hidden = !willOpen;
  stageDateTrigger.setAttribute('aria-expanded', String(willOpen));
});

stageDatePanel.addEventListener('click', (event) => {
  const dateButton = event.target.closest('[data-stage-date]');
  if (dateButton) {
    const selectedDate = dateButton.dataset.stageDate;
    if (draftStageDateEnd) {
      setDraftStageRange(selectedDate, '');
    } else if (selectedDate < draftStageDateStart) {
      setDraftStageRange(selectedDate, draftStageDateStart);
    } else {
      setDraftStageRange(draftStageDateStart, selectedDate);
    }
    return;
  }

  const rangeButton = event.target.closest('[data-stage-range]');
  if (!rangeButton) return;
  const today = '2026-07-17';
  const ranges = {
    today: [today, today],
    yesterday: [shiftStageDate(today, -1), shiftStageDate(today, -1)],
    last7: [shiftStageDate(today, -6), today],
    last7WithoutToday: [shiftStageDate(today, -7), shiftStageDate(today, -1)]
  };
  setDraftStageRange(...ranges[rangeButton.dataset.stageRange]);
});

stageDateConfirm.addEventListener('click', () => {
  stageDateStart = draftStageDateStart;
  stageDateEnd = draftStageDateEnd || draftStageDateStart;
  if (getStageDateRangeDays(stageDateStart, stageDateEnd) > 7) stageDateEnd = shiftStageDate(stageDateStart, 6);
  stageDateStartLabel.textContent = stageDateStart;
  stageDateEndLabel.textContent = stageDateEnd;
  stageDatePanel.hidden = true;
  stageDateTrigger.setAttribute('aria-expanded', 'false');
  renderStageData();
});

stageMetricOptions.addEventListener('click', (event) => {
  const button = event.target.closest('[data-stage-metric]');
  if (!button) return;
  const metricKey = button.dataset.stageMetric;
  if (selectedStageMetrics.has(metricKey)) {
    if (selectedStageMetrics.size === 1) return;
    selectedStageMetrics.delete(metricKey);
  } else {
    selectedStageMetrics.add(metricKey);
  }
  renderStageTrendChart();
});

stageDetailTableHead.addEventListener('click', (event) => {
  const button = event.target.closest('[data-stage-sort]');
  if (!button) return;
  const sortState = stageDetailSortState[stageTimeMode];
  const nextKey = button.dataset.stageSort;
  if (sortState.key === nextKey) {
    sortState.direction = sortState.direction === 'asc' ? 'desc' : 'asc';
  } else {
    sortState.key = nextKey;
    sortState.direction = 'asc';
  }
  renderStageDetailTable();
});

Array.from(effectDetailTableBody.rows).forEach((row, index) => {
  row.dataset.originalIndex = String(index);
});

let effectDetailSortKey = null;
let effectDetailSortDirection = 'asc';

effectDetailTableHead.addEventListener('click', (event) => {
  const button = event.target.closest('[data-effect-sort]');
  if (!button) return;
  const columnIndex = Number(button.dataset.effectSort);
  if (effectDetailSortKey === columnIndex) {
    effectDetailSortDirection = effectDetailSortDirection === 'asc' ? 'desc' : 'asc';
  } else {
    effectDetailSortKey = columnIndex;
    effectDetailSortDirection = 'asc';
  }

  const textColumns = new Set([0, 4]);
  const rows = Array.from(effectDetailTableBody.rows);
  rows.sort((firstRow, secondRow) => {
    const firstCell = firstRow.cells[columnIndex];
    const secondCell = secondRow.cells[columnIndex];
    const firstText = columnIndex === 0 ? firstCell.querySelector('strong').textContent.trim() : firstCell.textContent.trim();
    const secondText = columnIndex === 0 ? secondCell.querySelector('strong').textContent.trim() : secondCell.textContent.trim();
    const result = textColumns.has(columnIndex)
      ? firstText.localeCompare(secondText, 'zh-CN', { numeric: true })
      : (Number.parseFloat(firstText.replace(/[^\d.-]/g, '')) || 0) - (Number.parseFloat(secondText.replace(/[^\d.-]/g, '')) || 0);
    if (result !== 0) return effectDetailSortDirection === 'asc' ? result : -result;
    return Number(firstRow.dataset.originalIndex) - Number(secondRow.dataset.originalIndex);
  });
  rows.forEach((row) => effectDetailTableBody.appendChild(row));

  effectDetailTableHead.querySelectorAll('[data-effect-sort]').forEach((headerButton) => {
    const isActive = Number(headerButton.dataset.effectSort) === effectDetailSortKey;
    headerButton.classList.toggle('is-active', isActive);
    headerButton.classList.remove('is-asc', 'is-desc');
    if (isActive) headerButton.classList.add(`is-${effectDetailSortDirection}`);
    headerButton.closest('th').setAttribute('aria-sort', isActive ? (effectDetailSortDirection === 'asc' ? 'ascending' : 'descending') : 'none');
  });
});

stageTimeDimension.addEventListener('change', () => {
  stageTimeMode = stageTimeDimension.value;
  renderStageData();
});

document.addEventListener('click', (event) => {
  if (stageDatePicker.contains(event.target)) return;
  stageDatePanel.hidden = true;
  stageDateTrigger.setAttribute('aria-expanded', 'false');
});

stageTrendChart.addEventListener('mousemove', (event) => {
  const visibleRows = getVisibleStageData();
  if (!visibleRows.length) return;
  const chartRect = stageTrendChart.getBoundingClientRect();
  const cardRect = stageChartCard.getBoundingClientRect();
  const chartX = ((event.clientX - chartRect.left) / chartRect.width) * 820;
  const plotLeft = 42;
  const plotWidth = 820 - plotLeft - 16;
  const ratio = Math.max(0, Math.min(1, (chartX - plotLeft) / plotWidth));
  const rowIndex = Math.round(ratio * Math.max(0, visibleRows.length - 1));
  const row = visibleRows[rowIndex];
  const period = stageTimeMode === 'hour' ? `${row.date} ${row.period}` : row.date;
  stageChartTooltip.innerHTML = `
    <strong>${period}</strong>
    ${[...selectedStageMetrics].map((metricKey) => {
      const definition = stageMetricDefinitions[metricKey];
      return `<span><i style="background:${definition.color}"></i>${definition.label}：${formatStageMetric(metricKey, row[metricKey])}</span>`;
    }).join('')}
  `;
  stageChartTooltip.hidden = false;

  const localX = event.clientX - cardRect.left;
  const localY = event.clientY - cardRect.top;
  let tooltipX = localX + 14;
  let tooltipY = localY - 12;
  if (tooltipX + stageChartTooltip.offsetWidth > cardRect.width - 8) tooltipX = localX - stageChartTooltip.offsetWidth - 14;
  if (tooltipY + stageChartTooltip.offsetHeight > cardRect.height - 8) tooltipY = cardRect.height - stageChartTooltip.offsetHeight - 8;
  stageChartTooltip.style.left = `${Math.max(8, tooltipX)}px`;
  stageChartTooltip.style.top = `${Math.max(8, tooltipY)}px`;
});

stageTrendChart.addEventListener('mouseleave', () => {
  stageChartTooltip.hidden = true;
});

renderStageData();

function showDrawerPanel(panelName) {
  drawerTabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.drawerTab === panelName));
  drawerPanels.forEach((panel) => panel.classList.toggle('active', panel.dataset.drawerPanel === panelName));
  drawerScrollArea.scrollTop = 0;
}

tableBody.addEventListener('click', (event) => {
  const paymentButton = event.target.closest('[data-open-payment]');
  if (paymentButton) {
    const row = planRows[Number(paymentButton.dataset.openPayment)];
    legacyPaymentPlanName.textContent = row.name;
    legacyPaymentAccount.textContent = row.targetAccount;
    legacyPaymentLayer.hidden = false;
    return;
  }

  const selectRowButton = event.target.closest('[data-select-row]');
  if (selectRowButton) {
    const planId = selectRowButton.dataset.selectRow;
    if (selectedPlanIds.has(planId)) {
      selectedPlanIds.delete(planId);
    } else {
      selectedPlanIds.add(planId);
    }
    renderTable();
    return;
  }

  const redeliverButton = event.target.closest('[data-redeliver]');
  if (redeliverButton) {
    window.location.href = '新建长期计划.html';
    return;
  }

  const closeButton = event.target.closest('[data-close-delivery]');
  if (closeButton) {
    planRows[Number(closeButton.dataset.closeDelivery)].deliveryState = 'closed';
    renderTable();
    return;
  }

  const statusButton = event.target.closest('[data-toggle-status]');
  if (statusButton) {
    const row = planRows[Number(statusButton.dataset.toggleStatus)];
    if (row.deliveryState === 'closed') return;
    const isResume = row.deliveryState === 'paused';
    pendingStatusChange = { rowIndex: Number(statusButton.dataset.toggleStatus), nextState: isResume ? 'active' : 'paused' };
    statusConfirmTitle.textContent = isResume ? '恢复提示语' : '提示语';
    statusConfirmMessage.textContent = isResume ? '确认要恢复这条计划吗?' : '确认要暂停这条计划吗?';
    statusConfirmLayer.hidden = false;
    return;
  }

  const trigger = event.target.closest('[data-open-drawer]');
  if (!trigger) return;
  const row = planRows[Number(trigger.dataset.openDrawer)];
  drawerPlanName.textContent = row.name;
  drawerPlanId.textContent = row.id;
  drawerPlanAmount.textContent = `￥${String(row.amount).replace(/^￥/, '')}`;
  showDrawerPanel('plan-detail');
  dataDrawerLayer.hidden = false;
});

closeLegacyPaymentButton.addEventListener('click', () => {
  legacyPaymentLayer.hidden = true;
});

function closeStatusConfirm() {
  statusConfirmLayer.hidden = true;
  pendingStatusChange = null;
}

closeStatusConfirmButton.addEventListener('click', closeStatusConfirm);
cancelStatusConfirmButton.addEventListener('click', closeStatusConfirm);
confirmStatusChangeButton.addEventListener('click', () => {
  if (!pendingStatusChange) return;
  planRows[pendingStatusChange.rowIndex].deliveryState = pendingStatusChange.nextState;
  closeStatusConfirm();
  renderTable();
});

drawerTabs.forEach((tab) => {
  tab.addEventListener('click', () => showDrawerPanel(tab.dataset.drawerTab));
});

dataDrawerBack.addEventListener('click', () => {
  dataDrawerLayer.hidden = true;
});

const audienceRows = [
  { name: '11232', account: '部分', enabled: true, createdAt: '2026-06-23 11:01:55', creator: '高良测试' },
  { name: '001看模板长度展示单纯查看模板长度展示单纯查看模板长度展示单纯查看模板长度展示', account: '全部', enabled: true, createdAt: '2026-06-08 15:58:19', creator: '高良测试' },
  { name: '001看模板长度展示单纯查看模板长度展示单纯查看模板长度展示单纯查看模板长度展示', account: '全部', enabled: true, createdAt: '2026-06-08 15:58:16', creator: '高良测试' },
  { name: '001看模板长度展示单纯查看模板长度展示单纯查看模板长度展示单纯查看模板长度展示', account: '部分', enabled: true, createdAt: '2026-06-08 15:57:00', creator: '张军昌' },
  { name: '44-保存', account: '部分', enabled: true, createdAt: '2026-05-31 11:16:26', creator: '杨乔测试' },
  { name: '44', account: '全部', enabled: true, createdAt: '2026-05-22 17:24:06', creator: '杨乔测试' },
  { name: 'test', account: '部分', enabled: true, createdAt: '2026-04-18 18:19:41', creator: '面包超人-UI' },
  { name: '329定向人群模板-复制', account: '部分', enabled: true, createdAt: '2026-03-29 10:50:12', creator: '肖阳' },
  { name: '329全部适用', account: '部分', enabled: true, createdAt: '2026-03-29 10:49:50', creator: '肖阳' },
  { name: '329定向人群模板', account: '部分', enabled: true, createdAt: '2026-03-29 10:33:18', creator: '肖阳' }
];

const audienceTableBody = document.querySelector('#audience-table-body');
const audienceNameFilter = document.querySelector('#audience-name-filter');
const audienceCreatorFilter = document.querySelector('#audience-creator-filter');
const audienceResetButton = document.querySelector('#audience-reset-button');
const audienceSelectAll = document.querySelector('#audience-select-all');
const audienceTotal = document.querySelector('#audience-total');
const createAudienceTemplateButton = document.querySelector('#create-audience-template');
const refreshAudienceTableButton = document.querySelector('#refresh-audience-table');
const selectedAudienceRows = new Set();

function escapeAudienceText(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function getFilteredAudienceRows() {
  const name = audienceNameFilter.value.trim().toLowerCase();
  const creator = audienceCreatorFilter.value;
  return audienceRows
    .map((row, index) => ({ row, index }))
    .filter(({ row }) => (!name || row.name.toLowerCase().includes(name)) && (!creator || row.creator === creator));
}

function renderAudienceTable() {
  const visibleRows = getFilteredAudienceRows();
  audienceTableBody.innerHTML = visibleRows.map(({ row, index }) => `
    <tr>
      <td class="audience-check-column"><input type="checkbox" data-audience-select="${index}" aria-label="选择${escapeAudienceText(row.name)}" ${selectedAudienceRows.has(index) ? 'checked' : ''}></td>
      <td class="audience-name-cell">${escapeAudienceText(row.name)}</td>
      <td>${row.account}</td>
      <td><button class="audience-switch${row.enabled ? ' is-on' : ''}" type="button" data-audience-toggle="${index}" aria-label="${row.enabled ? '停用' : '启用'}${escapeAudienceText(row.name)}"></button></td>
      <td>${row.createdAt}</td>
      <td>${escapeAudienceText(row.creator)}</td>
      <td>
        <button class="audience-row-action" type="button" data-audience-edit="${index}">编辑</button>
        <button class="audience-row-action is-delete" type="button" data-audience-delete="${index}">删除</button>
        <button class="audience-row-action" type="button" data-audience-copy="${index}">复制</button>
      </td>
    </tr>
  `).join('');
  audienceTotal.textContent = audienceNameFilter.value || audienceCreatorFilter.value
    ? `共 ${visibleRows.length} 条`
    : '共 71 条';
  audienceSelectAll.checked = visibleRows.length > 0 && visibleRows.every(({ index }) => selectedAudienceRows.has(index));
  audienceSelectAll.indeterminate = visibleRows.some(({ index }) => selectedAudienceRows.has(index)) && !audienceSelectAll.checked;
}

audienceNameFilter.addEventListener('input', renderAudienceTable);
audienceCreatorFilter.addEventListener('change', renderAudienceTable);

audienceResetButton.addEventListener('click', () => {
  audienceNameFilter.value = '';
  audienceCreatorFilter.value = '';
  renderAudienceTable();
});

audienceSelectAll.addEventListener('change', () => {
  getFilteredAudienceRows().forEach(({ index }) => {
    if (audienceSelectAll.checked) selectedAudienceRows.add(index);
    else selectedAudienceRows.delete(index);
  });
  renderAudienceTable();
});

audienceTableBody.addEventListener('change', (event) => {
  const checkbox = event.target.closest('[data-audience-select]');
  if (!checkbox) return;
  const index = Number(checkbox.dataset.audienceSelect);
  if (checkbox.checked) selectedAudienceRows.add(index);
  else selectedAudienceRows.delete(index);
  renderAudienceTable();
});

audienceTableBody.addEventListener('click', (event) => {
  const toggle = event.target.closest('[data-audience-toggle]');
  if (toggle) {
    const row = audienceRows[Number(toggle.dataset.audienceToggle)];
    row.enabled = !row.enabled;
    renderAudienceTable();
    return;
  }

  const copyButton = event.target.closest('[data-audience-copy]');
  if (copyButton) {
    const source = audienceRows[Number(copyButton.dataset.audienceCopy)];
    audienceRows.unshift({ ...source, name: `${source.name}-复制`, createdAt: '2026-07-16 10:30:00' });
    selectedAudienceRows.clear();
    renderAudienceTable();
    return;
  }

  const deleteButton = event.target.closest('[data-audience-delete]');
  if (deleteButton) {
    audienceRows.splice(Number(deleteButton.dataset.audienceDelete), 1);
    selectedAudienceRows.clear();
    renderAudienceTable();
    return;
  }

  const editButton = event.target.closest('[data-audience-edit]');
  if (editButton) {
    const row = audienceRows[Number(editButton.dataset.audienceEdit)];
    const nextName = window.prompt('修改定向模板名称', row.name);
    if (nextName && nextName.trim()) row.name = nextName.trim();
    renderAudienceTable();
  }
});

createAudienceTemplateButton.addEventListener('click', () => {
  const name = window.prompt('请输入定向模板名称', '新建定向模板');
  if (!name || !name.trim()) return;
  audienceRows.unshift({ name: name.trim(), account: '部分', enabled: true, createdAt: '2026-07-16 10:30:00', creator: '高良测试' });
  selectedAudienceRows.clear();
  renderAudienceTable();
});

refreshAudienceTableButton.addEventListener('click', () => {
  refreshAudienceTableButton.animate(
    [{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }],
    { duration: 420, easing: 'ease-out' }
  );
  renderAudienceTable();
});

document.querySelectorAll('.audience-pagination .page-number').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.audience-pagination .page-number').forEach((candidate) => candidate.classList.remove('active'));
    button.classList.add('active');
  });
});

renderAudienceTable();

const planGroupRows = [
  { id: 339, name: '计划分组名称长度计划分组名称长度计划分组', type: '长期计划', linked: 5, heating: 0, createdAt: '2026-05-28 17:58:10' },
  { id: 319, name: '2', type: '标准计划', linked: 11, heating: 0, createdAt: '2026-05-22 17:22:17' },
  { id: 318, name: '444', type: '长期计划', linked: 27, heating: 0, createdAt: '2026-05-14 15:34:10' },
  { id: 317, name: 'ceshi', type: '标准计划', linked: 12, heating: 0, createdAt: '2026-05-14 15:32:19' },
  { id: 304, name: 'test', type: '长期计划', linked: 5, heating: 0, createdAt: '2026-04-18 12:19:23' },
  { id: 138, name: 'dj-测试-1', type: '标准计划', linked: 5, heating: 0, createdAt: '2026-03-30 20:41:20' },
  { id: 137, name: '测试330', type: '长期计划', linked: 0, heating: 0, createdAt: '2026-03-30 17:03:38' },
  { id: 135, name: '329回归分组', type: '标准计划', linked: 18, heating: 0, createdAt: '2026-03-29 10:18:39' },
  { id: 128, name: '计划12', type: '长期计划', linked: 14, heating: 0, createdAt: '2026-03-04 18:11:21' },
  { id: 125, name: '2.4测试', type: '标准计划', linked: 0, heating: 0, createdAt: '2026-02-04 18:20:33' }
];

const planGroupTableBody = document.querySelector('#plan-group-table-body');
const planGroupFilterInput = document.querySelector('#plan-group-filter-input');
const planGroupResetButton = document.querySelector('#plan-group-reset');
const createPlanGroupButton = document.querySelector('#create-plan-group');
const refreshPlanGroupButton = document.querySelector('#refresh-plan-group');
const planGroupTotal = document.querySelector('#plan-group-total');
const planGroupModal = document.querySelector('#plan-group-modal');
const planGroupDialogTitle = document.querySelector('#plan-group-dialog-title');
const closePlanGroupModalButton = document.querySelector('#close-plan-group-modal');
const cancelPlanGroupModalButton = document.querySelector('#cancel-plan-group-modal');
const savePlanGroupButton = document.querySelector('#save-plan-group');
const planGroupNameInput = document.querySelector('#plan-group-name-input');
const planGroupError = document.querySelector('#plan-group-error');
let editingPlanGroupIndex = -1;
let planGroupTotalCount = 27;

function renderPlanTypeTags(type) {
  const tags = [];
  if (type.includes('标准计划')) tags.push('<span class="plan-type-tag standard">标准计划</span>');
  if (type.includes('长期计划')) tags.push('<span class="plan-type-tag long-term">长期计划</span>');
  return `<div class="plan-type-tags">${tags.join('')}</div>`;
}

function renderPlanGroupTable() {
  const keyword = planGroupFilterInput.value.trim().toLowerCase();
  const visibleRows = planGroupRows
    .map((row, index) => ({ row, index }))
    .filter(({ row }) => !keyword || row.name.toLowerCase().includes(keyword));

  planGroupTableBody.innerHTML = visibleRows.map(({ row, index }) => `
    <tr>
      <td>${row.id}</td>
      <td>${escapeAudienceText(row.name)}</td>
      <td class="number-column">${row.linked}</td>
      <td class="number-column">${row.heating}</td>
      <td>${row.createdAt}</td>
      <td><button class="plan-group-action" type="button" data-plan-group-edit="${index}">编辑</button><button class="plan-group-action is-delete" type="button" data-plan-group-delete="${index}">删除</button></td>
    </tr>
  `).join('');
  planGroupTotal.textContent = keyword
    ? `共 ${visibleRows.length} 条`
    : `共 ${planGroupTotalCount} 条`;
}

function openPlanGroupModal(index = -1) {
  editingPlanGroupIndex = index;
  planGroupDialogTitle.textContent = index < 0 ? '新增计划分组' : '编辑计划分组';
  planGroupNameInput.value = index < 0 ? '' : planGroupRows[index].name;
  planGroupError.hidden = true;
  planGroupModal.hidden = false;
  planGroupNameInput.focus();
}

function closePlanGroupModal() {
  planGroupModal.hidden = true;
}

createPlanGroupButton.addEventListener('click', () => openPlanGroupModal());
closePlanGroupModalButton.addEventListener('click', closePlanGroupModal);
cancelPlanGroupModalButton.addEventListener('click', closePlanGroupModal);
planGroupModal.addEventListener('click', (event) => {
  if (event.target === planGroupModal) closePlanGroupModal();
});

savePlanGroupButton.addEventListener('click', () => {
  const name = planGroupNameInput.value.trim();
  if (!name) {
    planGroupError.hidden = false;
    return;
  }

  if (editingPlanGroupIndex < 0) {
    planGroupRows.unshift({
      id: Math.max(...planGroupRows.map((row) => row.id)) + 1,
      name,
      linked: 0,
      heating: 0,
      createdAt: '2026-07-16 10:30:00'
    });
    planGroupTotalCount += 1;
  } else {
    planGroupRows[editingPlanGroupIndex].name = name;
  }
  closePlanGroupModal();
  renderPlanGroupTable();
});

planGroupTableBody.addEventListener('click', (event) => {
  const editButton = event.target.closest('[data-plan-group-edit]');
  if (editButton) {
    openPlanGroupModal(Number(editButton.dataset.planGroupEdit));
    return;
  }

  const deleteButton = event.target.closest('[data-plan-group-delete]');
  if (!deleteButton) return;
  planGroupRows.splice(Number(deleteButton.dataset.planGroupDelete), 1);
  planGroupTotalCount = Math.max(0, planGroupTotalCount - 1);
  renderPlanGroupTable();
});

planGroupFilterInput.addEventListener('input', renderPlanGroupTable);
planGroupResetButton.addEventListener('click', () => {
  planGroupFilterInput.value = '';
  renderPlanGroupTable();
});

refreshPlanGroupButton.addEventListener('click', () => {
  refreshPlanGroupButton.animate(
    [{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }],
    { duration: 420, easing: 'ease-out' }
  );
  renderPlanGroupTable();
});

document.querySelectorAll('.plan-group-pagination .page-number').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.plan-group-pagination .page-number').forEach((candidate) => candidate.classList.remove('active'));
    button.classList.add('active');
  });
});

renderPlanGroupTable();

const dailyFinanceRows = [
  { date: '2026-07-16', type: '标准计划', plans: 0, approved: 0, occupied: 0, consumed: 0, ecommerce: 0, guarantee: '0.00', orderCount: 0, orderAmount: 0, dealCount: 0, dealAmount: 0, roi: 0, viewers: 0 },
  { date: '2026-07-15', type: '长期计划', plans: 0, approved: 0, occupied: 0, consumed: 0, ecommerce: 0, guarantee: '0.00', orderCount: 0, orderAmount: 0, dealCount: 0, dealAmount: 0, roi: 0, viewers: 0 },
  { date: '2026-07-14', type: '标准计划', plans: 0, approved: 0, occupied: 0, consumed: 0, ecommerce: 0, guarantee: '0.00', orderCount: 0, orderAmount: 0, dealCount: 0, dealAmount: 0, roi: 0, viewers: 0 },
  { date: '2026-07-13', type: '长期计划', plans: 1, approved: 0, occupied: 0, consumed: 0, ecommerce: 0, guarantee: '0.00', orderCount: 0, orderAmount: 0, dealCount: 0, dealAmount: 0, roi: 0, viewers: 0 },
  { date: '2026-07-12', type: '标准计划', plans: 0, approved: 0, occupied: 0, consumed: 0, ecommerce: 0, guarantee: '0.00', orderCount: 0, orderAmount: 0, dealCount: 0, dealAmount: 0, roi: 0, viewers: 0 },
  { date: '2026-07-11', type: '长期计划', plans: 0, approved: 0, occupied: 0, consumed: 0, ecommerce: 0, guarantee: '0.00', orderCount: 0, orderAmount: 0, dealCount: 0, dealAmount: 0, roi: 0, viewers: 0 },
  { date: '2026-07-10', type: '标准计划', plans: 1, approved: 0, occupied: 0, consumed: 0, ecommerce: 0, guarantee: '0.00', orderCount: 0, orderAmount: 0, dealCount: 0, dealAmount: 0, roi: 0, viewers: 0 },
  { date: '2026-07-09', type: '长期计划', plans: 1, approved: 0, occupied: 0, consumed: 0, ecommerce: 0, guarantee: '0.00', orderCount: 0, orderAmount: 0, dealCount: 0, dealAmount: 0, roi: 0, viewers: 0 },
  { date: '2026-07-08', type: '标准计划', plans: 2, approved: 0, occupied: 0, consumed: 0, ecommerce: 0, guarantee: '0.00', orderCount: 0, orderAmount: 0, dealCount: 0, dealAmount: 0, roi: 0, viewers: 0 },
  { date: '2026-07-07', type: '长期计划', plans: 18, approved: 3, occupied: 60, consumed: 0, ecommerce: 0, guarantee: '0.00', orderCount: 0, orderAmount: 0, dealCount: 0, dealAmount: 0, roi: 0, viewers: 136 }
];

const monthlyFinanceRows = [
  { date: '2026-07', type: '标准计划', plans: 12, approved: 5, occupied: 60, consumed: '187.56', ecommerce: 0, guarantee: '0.00', orderCount: 0, orderAmount: 0, dealCount: 0, dealAmount: 0, roi: 0, viewers: 136 },
  { date: '2026-07', type: '长期计划', plans: 11, approved: 3, occupied: 0, consumed: 0, ecommerce: 0, guarantee: '0.00', orderCount: 0, orderAmount: 0, dealCount: 0, dealAmount: 0, roi: 0, viewers: 0 },
  { date: '2026-06', type: '标准计划', plans: 8, approved: 2, occupied: 0, consumed: 0, ecommerce: 0, guarantee: '0.00', orderCount: 0, orderAmount: 0, dealCount: 0, dealAmount: 0, roi: 0, viewers: 0 },
  { date: '2026-06', type: '长期计划', plans: 6, approved: 1, occupied: 0, consumed: 0, ecommerce: 0, guarantee: '0.00', orderCount: 0, orderAmount: 0, dealCount: 0, dealAmount: 0, roi: 0, viewers: 0 }
];

const financeTableBody = document.querySelector('#finance-table-body');
const financePlanTypeFilter = document.querySelector('#finance-plan-type-filter');
const financeAccountFilter = document.querySelector('#finance-account-filter');
const financeTargetFilter = document.querySelector('#finance-target-filter');
const financeResetButton = document.querySelector('#finance-reset');
const financeRefreshButton = document.querySelector('#finance-refresh');
const financeTotal = document.querySelector('#finance-total');
const financeModeButtons = document.querySelectorAll('[data-finance-mode]');
let financeMode = 'day';

function renderFinanceTable() {
  const sourceRows = financeMode === 'day' ? dailyFinanceRows : monthlyFinanceRows;
  const selectedType = financePlanTypeFilter.value;
  const visibleRows = sourceRows.filter((row) => !selectedType || row.type === selectedType);
  financeTableBody.innerHTML = visibleRows.map((row) => `
    <tr>
      <td>${row.date}</td>
      <td class="finance-plan-type">${renderPlanTypeTags(row.type)}</td>
      <td>${row.plans}</td>
      <td>${row.approved}</td>
      <td>${row.occupied}</td>
      <td>${row.consumed}</td>
      <td>${row.ecommerce}</td>
      <td>${row.guarantee}</td>
      <td>${row.orderCount}</td>
      <td>${row.orderAmount}</td>
      <td>${row.dealCount}</td>
      <td>${row.dealAmount}</td>
      <td>${row.roi}</td>
      <td>${row.viewers}</td>
    </tr>
  `).join('');
  financeTotal.textContent = selectedType ? `共 ${visibleRows.length} 条` : (financeMode === 'day' ? '共 31 条' : '共 12 条');
}

financePlanTypeFilter.addEventListener('change', renderFinanceTable);
financeResetButton.addEventListener('click', () => {
  financeAccountFilter.value = '';
  financeTargetFilter.value = '';
  financePlanTypeFilter.value = '';
  renderFinanceTable();
});

financeModeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    financeMode = button.dataset.financeMode;
    financeModeButtons.forEach((candidate) => candidate.classList.toggle('active', candidate === button));
    renderFinanceTable();
  });
});

financeRefreshButton.addEventListener('click', () => {
  financeRefreshButton.animate(
    [{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }],
    { duration: 420, easing: 'ease-out' }
  );
  renderFinanceTable();
});

document.querySelectorAll('.finance-pagination .page-number').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.finance-pagination .page-number').forEach((candidate) => candidate.classList.remove('active'));
    button.classList.add('active');
  });
});

renderFinanceTable();

const shortVideoRows = [
  { account: '最好的交待', note: '', description: '快来玩水吧，在这等着你@卡皮巴拉克里马擦', type: '标准计划', deliveries: 7 },
  { account: '最好的交待', note: '', description: '都来玩水吧！！！@卡皮巴拉克里马擦', type: '长期计划', deliveries: 11 },
  { account: '最好的交待', note: '', description: '青山绿水，流水潺潺好郊游 @卡皮巴拉克里马擦', type: '标准计划', deliveries: 17 },
  { account: 'tel小小店非正式账号', note: '', description: '视频号-视频描述内容展示，今天是周五，六...', type: '长期计划', deliveries: 41 },
  { account: '李宁官方品牌店', note: '', description: '运动休闲就穿李宁R037休闲跑鞋！#李宁 #跑...', type: '标准计划', deliveries: 4 },
  { account: '李宁官方品牌店', note: '', description: '就要透气不闷脚！李宁R037休闲跑鞋！#李宁 ...', type: '长期计划', deliveries: 4 },
  { account: '李宁官方品牌店', note: '', description: '这么轻盈的跑鞋！李宁R037休闲跑鞋！#李宁 ...', type: '标准计划', deliveries: 4 },
  { account: 'tel小小店非正式账号', note: '榴莲 - 副本 (2)', description: '榴莲小店查看', type: '长期计划', deliveries: 1 },
  { account: '最好的交待', note: '', description: '好多羊驼，这是描述', type: '标准计划', deliveries: 19 },
  { account: '李宁官方品牌店', note: '夏季跑鞋', description: '轻盈透气跑鞋合集', type: '长期计划', deliveries: 8 }
];

const shortVideoTableBody = document.querySelector('#short-video-table-body');
const shortVideoNoteFilter = document.querySelector('#short-video-note-filter');
const shortVideoDescriptionFilter = document.querySelector('#short-video-description-filter');
const shortVideoTargetFilter = document.querySelector('#short-video-target-filter');
const shortVideoPlanTypeFilter = document.querySelector('#short-video-plan-type-filter');
const shortVideoResetButton = document.querySelector('#short-video-reset');
const shortVideoRefreshButton = document.querySelector('#short-video-refresh');
const shortVideoTotal = document.querySelector('#short-video-total');
const shortVideoDetailLayer = document.querySelector('#short-video-detail-layer');
const shortVideoDetailBody = document.querySelector('#short-video-detail-body');

function getFilteredShortVideoRows() {
  const note = shortVideoNoteFilter.value.trim().toLowerCase();
  const description = shortVideoDescriptionFilter.value.trim().toLowerCase();
  const target = shortVideoTargetFilter.value;
  const type = shortVideoPlanTypeFilter.value;
  return shortVideoRows.map((row, index) => ({ row, index })).filter(({ row }) =>
    (!note || row.note.toLowerCase().includes(note)) &&
    (!description || row.description.toLowerCase().includes(description)) &&
    (!target || row.account === target) &&
    (!type || row.type === type)
  );
}

function renderShortVideoTable() {
  const visibleRows = getFilteredShortVideoRows();
  shortVideoTableBody.innerHTML = visibleRows.map(({ row, index }) => `
    <tr>
      <td class="short-video-check"><input type="checkbox" aria-label="选择第${index + 1}条短视频数据"></td>
      <td><div class="short-video-account"><span class="short-video-avatar">${row.account.slice(0, 1)}</span><span>${escapeAudienceText(row.account)}</span></div></td>
      <td>${row.note ? `${escapeAudienceText(row.note)} <span class="short-video-link-number">✎</span>` : '<span class="short-video-link-number">✎</span>'}</td>
      <td><div class="short-video-description"><span class="short-video-thumb"></span><span>${escapeAudienceText(row.description)}</span></div></td>
      <td class="short-video-plan-type">${renderPlanTypeTags(row.type)}</td>
      <td><button class="short-video-delivery-link" type="button" data-short-video-detail="${index}">${row.deliveries}</button></td>
      <td>0</td>
      <td>0.00</td>
      <td>0.00</td>
      <td>0</td>
      <td>0</td>
      <td>0.00%</td>
      <td>0</td>
      <td>0</td>
    </tr>
  `).join('');
  const filtering = shortVideoNoteFilter.value || shortVideoDescriptionFilter.value || shortVideoTargetFilter.value || shortVideoPlanTypeFilter.value;
  shortVideoTotal.textContent = filtering ? `共 ${visibleRows.length} 条` : '共 22 条';
}

[shortVideoNoteFilter, shortVideoDescriptionFilter].forEach((input) => input.addEventListener('input', renderShortVideoTable));
shortVideoTargetFilter.addEventListener('change', renderShortVideoTable);
shortVideoPlanTypeFilter.addEventListener('change', renderShortVideoTable);

shortVideoResetButton.addEventListener('click', () => {
  shortVideoNoteFilter.value = '';
  shortVideoDescriptionFilter.value = '';
  shortVideoTargetFilter.value = '';
  shortVideoPlanTypeFilter.selectedIndex = 0;
  renderShortVideoTable();
});

shortVideoTableBody.addEventListener('click', (event) => {
  const detailButton = event.target.closest('[data-short-video-detail]');
  if (!detailButton) return;
  const row = shortVideoRows[Number(detailButton.dataset.shortVideoDetail)];
  shortVideoDetailBody.innerHTML = `<tr><td>${escapeAudienceText(row.description.includes('花光') ? row.description : '产品测试，花光所有的豆310')}</td><td>已取消</td><td>0</td><td>0</td><td>0.00%</td><td>0.00</td><td>0</td><td>0.00</td><td>0.00</td></tr>`;
  shortVideoDetailLayer.hidden = false;
});

function closeShortVideoDetail() { shortVideoDetailLayer.hidden = true; }
document.querySelector('#close-short-video-detail').addEventListener('click', closeShortVideoDetail);
document.querySelector('#cancel-short-video-detail').addEventListener('click', closeShortVideoDetail);
document.querySelector('#confirm-short-video-detail').addEventListener('click', closeShortVideoDetail);
shortVideoDetailLayer.addEventListener('click', (event) => { if (event.target === shortVideoDetailLayer) closeShortVideoDetail(); });

shortVideoRefreshButton.addEventListener('click', () => {
  shortVideoRefreshButton.animate(
    [{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }],
    { duration: 420, easing: 'ease-out' }
  );
  renderShortVideoTable();
});

document.querySelectorAll('.short-video-pagination .page-number').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.short-video-pagination .page-number').forEach((candidate) => candidate.classList.remove('active'));
    button.classList.add('active');
  });
});

renderShortVideoTable();

const shutdownRows = [
  { strategyType: '亏损监控', name: '或者', planType: '标准计划', rule: '消耗金额>3元或无阶段商品点击时长>=32分钟', dimension: '指定订单', method: '自动关停', period: '全天', creator: '杨乔测试', createdAt: '2026-06-10 14:39:36', enabled: true },
  { strategyType: '自定义', name: '44', planType: '长期计划', rule: '空耗值>2元', dimension: '指定订单', method: '自动关停', period: '全天', creator: '高良测试', createdAt: '2026-06-09 17:22:21', enabled: true },
  { strategyType: '自定义', name: '2.8关停回归', planType: '标准计划', rule: '无阶段商品点击时长>=14分钟或消耗金额>0.1元', dimension: '指定订单', method: '自动关停', period: '全天', creator: '高良测试', createdAt: '2026-03-30 17:32:32', enabled: true },
  { strategyType: '自定义', name: '（勿关）测试账号关停兜底策略', planType: '长期计划', rule: '消耗金额>1元', dimension: '投放号', method: '自动关停', period: '全天', creator: '师文科', createdAt: '2026-03-27 15:53:35', enabled: false },
  { strategyType: '自定义', name: '关停逻辑回归', planType: '标准计划', rule: 'ROI<0.5', dimension: '指定订单', method: '自动关停', period: '全天', creator: '高良测试', createdAt: '2026-03-12 15:48:48', enabled: true },
  { strategyType: '自定义', name: '核心隐藏2', planType: '长期计划', rule: '空耗值>2元且成交订单数<2单', dimension: '指定订单', method: '自动关停', period: '全天', creator: '高良测试', createdAt: '2026-03-10 11:01:20', enabled: false },
  { strategyType: '自定义', name: '核心功能隐藏', planType: '标准计划', rule: '无阶段商品点击时长>2分钟且存在阶段消耗>1元', dimension: '指定订单', method: '自动关停', period: '全天', creator: '高良测试', createdAt: '2026-03-09 14:22:58', enabled: false }
];

const shutdownTableBody = document.querySelector('#shutdown-table-body');
const shutdownNameFilter = document.querySelector('#shutdown-name-filter');
const shutdownPlanTypeFilter = document.querySelector('#shutdown-plan-type-filter');
const shutdownPlanTypeTrigger = document.querySelector('#shutdown-plan-type-trigger');
const shutdownPlanTypeLabel = document.querySelector('#shutdown-plan-type-label');
const shutdownPlanTypePanel = document.querySelector('#shutdown-plan-type-panel');
const shutdownPlanTypeOptions = shutdownPlanTypePanel.querySelectorAll('[data-shutdown-plan-type]');
const shutdownResetButton = document.querySelector('#shutdown-reset');
const shutdownRefreshButton = document.querySelector('#shutdown-refresh');
const shutdownTotal = document.querySelector('#shutdown-total');
const shutdownModal = document.querySelector('#shutdown-strategy-modal');
const shutdownDialogTitle = document.querySelector('#shutdown-dialog-title');
const shutdownNameInput = document.querySelector('#shutdown-strategy-name');
const shutdownStrategyPlanType = document.querySelector('#shutdown-strategy-plan-type');
const shutdownStrategyType = document.querySelector('#shutdown-strategy-type');
const shutdownStrategyRule = document.querySelector('#shutdown-strategy-rule');
let editingShutdownIndex = -1;
const selectedShutdownPlanTypes = new Set();

function renderShutdownTable() {
  const keyword = shutdownNameFilter.value.trim().toLowerCase();
  const rows = shutdownRows.map((row, index) => ({ row, index })).filter(({ row }) =>
    (!keyword || row.name.toLowerCase().includes(keyword)) &&
    (selectedShutdownPlanTypes.size === 0 || [...selectedShutdownPlanTypes].some((type) => row.planType.includes(type)))
  );
  shutdownTableBody.innerHTML = rows.map(({ row, index }) => `
    <tr><td>${row.strategyType}</td><td>${escapeAudienceText(row.name)}</td><td>${renderPlanTypeTags(row.planType)}</td><td title="${escapeAudienceText(row.rule)}">${escapeAudienceText(row.rule)}</td><td>${row.dimension}</td><td>${row.method}</td><td>${row.period}</td><td>${row.creator}</td><td>${row.createdAt}</td><td><button class="shutdown-switch${row.enabled ? ' is-on' : ''}" type="button" data-shutdown-toggle="${index}"></button><div><button class="shutdown-action" type="button" data-shutdown-edit="${index}">修改</button><button class="shutdown-action is-delete" type="button" data-shutdown-delete="${index}">删除</button></div></td></tr>
  `).join('');
  shutdownTotal.textContent = keyword || selectedShutdownPlanTypes.size ? `共 ${rows.length} 条` : '共 65 条';
}

function updateShutdownPlanTypeLabel() {
  const selectedTypes = [...selectedShutdownPlanTypes];
  shutdownPlanTypeLabel.textContent = selectedTypes.length ? selectedTypes.join('、') : '选择计划类型';
  shutdownPlanTypeTrigger.classList.toggle('has-value', selectedTypes.length > 0);
}

function closeShutdownPlanTypeFilter() {
  shutdownPlanTypePanel.hidden = true;
  shutdownPlanTypeTrigger.setAttribute('aria-expanded', 'false');
}

function openShutdownModal(index = -1) {
  editingShutdownIndex = index;
  const row = index < 0 ? null : shutdownRows[index];
  shutdownDialogTitle.textContent = row ? '修改关停策略' : '新建关停策略';
  shutdownNameInput.value = row ? row.name : '';
  shutdownStrategyPlanType.value = row ? row.planType : '标准计划';
  shutdownStrategyType.value = row ? row.strategyType : '自定义';
  shutdownStrategyRule.value = row ? row.rule : '消耗金额>1元';
  shutdownModal.hidden = false;
  shutdownNameInput.focus();
}

function closeShutdownModal() { shutdownModal.hidden = true; }
document.querySelector('#create-shutdown-strategy').addEventListener('click', () => openShutdownModal());
document.querySelector('#close-shutdown-modal').addEventListener('click', closeShutdownModal);
document.querySelector('#cancel-shutdown-modal').addEventListener('click', closeShutdownModal);
shutdownModal.addEventListener('click', (event) => { if (event.target === shutdownModal) closeShutdownModal(); });
document.querySelector('#save-shutdown-strategy').addEventListener('click', () => {
  const name = shutdownNameInput.value.trim();
  if (!name) { shutdownNameInput.focus(); return; }
  const planType = shutdownStrategyPlanType.value || '标准计划、长期计划';
  if (editingShutdownIndex < 0) {
    shutdownRows.unshift({ strategyType: shutdownStrategyType.value, name, planType, rule: shutdownStrategyRule.value, dimension: '指定订单', method: '自动关停', period: '全天', creator: '高良测试', createdAt: '2026-07-16 10:30:00', enabled: true });
  } else {
    Object.assign(shutdownRows[editingShutdownIndex], { strategyType: shutdownStrategyType.value, name, planType, rule: shutdownStrategyRule.value });
  }
  closeShutdownModal();
  renderShutdownTable();
});

shutdownTableBody.addEventListener('click', (event) => {
  const toggle = event.target.closest('[data-shutdown-toggle]');
  if (toggle) { const row = shutdownRows[Number(toggle.dataset.shutdownToggle)]; row.enabled = !row.enabled; renderShutdownTable(); return; }
  const edit = event.target.closest('[data-shutdown-edit]');
  if (edit) { openShutdownModal(Number(edit.dataset.shutdownEdit)); return; }
  const remove = event.target.closest('[data-shutdown-delete]');
  if (remove) { shutdownRows.splice(Number(remove.dataset.shutdownDelete), 1); renderShutdownTable(); }
});

shutdownNameFilter.addEventListener('input', renderShutdownTable);
shutdownPlanTypeTrigger.addEventListener('click', () => {
  const nextOpen = shutdownPlanTypePanel.hidden;
  shutdownPlanTypePanel.hidden = !nextOpen;
  shutdownPlanTypeTrigger.setAttribute('aria-expanded', String(nextOpen));
});
shutdownPlanTypePanel.addEventListener('click', (event) => {
  const option = event.target.closest('[data-shutdown-plan-type]');
  if (!option) return;
  const planType = option.dataset.shutdownPlanType;
  if (selectedShutdownPlanTypes.has(planType)) selectedShutdownPlanTypes.delete(planType);
  else selectedShutdownPlanTypes.add(planType);
  const isSelected = selectedShutdownPlanTypes.has(planType);
  option.classList.toggle('is-selected', isSelected);
  option.setAttribute('aria-pressed', String(isSelected));
  updateShutdownPlanTypeLabel();
  renderShutdownTable();
});
document.addEventListener('click', (event) => {
  if (!shutdownPlanTypeFilter.contains(event.target)) closeShutdownPlanTypeFilter();
});
shutdownResetButton.addEventListener('click', () => {
  shutdownNameFilter.value = '';
  selectedShutdownPlanTypes.clear();
  shutdownPlanTypeOptions.forEach((option) => {
    option.classList.remove('is-selected');
    option.setAttribute('aria-pressed', 'false');
  });
  updateShutdownPlanTypeLabel();
  closeShutdownPlanTypeFilter();
  document.querySelectorAll('.shutdown-filter select').forEach((select) => { select.selectedIndex = 0; });
  renderShutdownTable();
});
shutdownRefreshButton.addEventListener('click', () => { shutdownRefreshButton.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], { duration: 420 }); renderShutdownTable(); });
document.querySelectorAll('.shutdown-tabs button').forEach((button) => button.addEventListener('click', () => { document.querySelectorAll('.shutdown-tabs button').forEach((item) => item.classList.toggle('active', item === button)); }));

const deliveryAccountRows = [
  { name: '畅移小店', note: '测试专用账号', kind: '企业', status: '在线', countdown: '3天23小时4分37秒', balance: '2,792.20', partners: 3, login: '2026-07-13 11:11:35' },
  { name: '夜明半声晴', note: '-', kind: 'iOS', status: '离线', countdown: '离线中', balance: '0.00', partners: 0, login: '2026-07-13 14:54:26' },
  { name: 'tel小小店非正式账号', note: '-', kind: '安卓', status: '离线', countdown: '离线中', balance: '0.00', partners: 0, login: '2026-06-22 11:24:21' },
  { name: '杭州畅码6', note: '韩束账号-严禁使用', kind: '企业', status: '离线', countdown: '离线中', balance: '42,498.70', partners: 1, login: '2026-06-08 07:35:03' },
  { name: 'kaifeixie', note: '-', kind: '安卓', status: '离线', countdown: '离线中', balance: '0.00', partners: 0, login: '2026-05-07 14:50:13' },
  { name: '杭州畅码2', note: '-', kind: '企业', status: '离线', countdown: '离线中', balance: '290,506.80', partners: 1, login: '2026-04-21 10:53:17' },
  { name: '面条和布丁', note: '-', kind: '安卓', status: '离线', countdown: '离线中', balance: '0.00', partners: 0, login: '2026-04-03 14:40:12' },
  { name: 'Ouygj', note: '-', kind: 'iOS', status: '离线', countdown: '离线中', balance: '0.00', partners: 0, login: '2026-04-02 16:23:15' }
];

const deliveryAccountTableBody = document.querySelector('#delivery-account-table-body');
const deliveryAccountNameFilter = document.querySelector('#delivery-account-name-filter');
const deliveryAccountStatusFilter = document.querySelector('#delivery-account-status-filter');
const offlineReminderModal = document.querySelector('#offline-reminder-modal');

function renderDeliveryAccountTable() {
  const keyword = deliveryAccountNameFilter.value.trim().toLowerCase();
  const status = deliveryAccountStatusFilter.value;
  const rows = deliveryAccountRows.filter((row) => (!keyword || row.name.toLowerCase().includes(keyword)) && (!status || row.status === status));
  deliveryAccountTableBody.innerHTML = rows.map((row) => `
    <tr><td><div class="delivery-account-name"><span class="delivery-account-avatar">${row.name.slice(0, 1)}</span><span>${escapeAudienceText(row.name)}</span></div></td><td>${escapeAudienceText(row.note)}　✎</td><td>${row.kind}</td><td><span class="${row.status === '在线' ? 'account-online' : 'account-offline'}">${row.status}</span></td><td>${row.countdown}</td><td class="delivery-account-balance">${row.balance}</td><td class="delivery-account-partner">合作作者：${row.partners}人<br><button class="delivery-account-link is-orange" type="button">详情</button></td><td>${row.login}</td><td><button class="delivery-account-link" type="button">重新授权</button>${row.status === '在线' ? '<button class="delivery-account-link" type="button">取消授权</button><button class="delivery-account-link" type="button">分身登录</button>' : ''}</td></tr>
  `).join('');
  document.querySelector('#delivery-account-total').textContent = keyword || status ? `共 ${rows.length} 条` : '共 41 条';
}

deliveryAccountNameFilter.addEventListener('input', renderDeliveryAccountTable);
deliveryAccountStatusFilter.addEventListener('change', renderDeliveryAccountTable);
document.querySelector('#delivery-account-reset').addEventListener('click', () => { deliveryAccountNameFilter.value = ''; deliveryAccountStatusFilter.value = ''; renderDeliveryAccountTable(); });
document.querySelector('#delivery-account-refresh').addEventListener('click', (event) => { event.currentTarget.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], { duration: 420 }); renderDeliveryAccountTable(); });

function closeOfflineReminder() { offlineReminderModal.hidden = true; }
document.querySelector('#offline-reminder-settings').addEventListener('click', () => { offlineReminderModal.hidden = false; });
document.querySelector('#close-offline-reminder').addEventListener('click', closeOfflineReminder);
document.querySelector('#cancel-offline-reminder').addEventListener('click', closeOfflineReminder);
document.querySelector('#save-offline-reminder').addEventListener('click', closeOfflineReminder);
offlineReminderModal.addEventListener('click', (event) => { if (event.target === offlineReminderModal) closeOfflineReminder(); });

renderShutdownTable();
renderDeliveryAccountTable();
