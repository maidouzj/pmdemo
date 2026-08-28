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
const planStatusFilter = document.querySelector('#plan-status-filter');
const longTermFilterReset = document.querySelector('#long-term-filter-reset');
const longTermStatisticsPicker = document.querySelector('#long-term-statistics-picker');
const longTermStatisticsTrigger = document.querySelector('#long-term-statistics-trigger');
const longTermStatisticsPanel = document.querySelector('#long-term-statistics-panel');
const longTermStatisticsStartLabel = document.querySelector('#long-term-statistics-start-label');
const longTermStatisticsEndLabel = document.querySelector('#long-term-statistics-end-label');
const longTermStatisticsStartInput = document.querySelector('#long-term-statistics-start-input');
const longTermStatisticsEndInput = document.querySelector('#long-term-statistics-end-input');
const longTermStatisticsCancel = document.querySelector('#long-term-statistics-cancel');
const longTermStatisticsConfirm = document.querySelector('#long-term-statistics-confirm');
const longTermStatisticsLeftMonth = document.querySelector('#long-term-statistics-left-month');
const longTermStatisticsRightMonth = document.querySelector('#long-term-statistics-right-month');
const longTermStatisticsLeftDays = document.querySelector('#long-term-statistics-left-days');
const longTermStatisticsRightDays = document.querySelector('#long-term-statistics-right-days');
const longTermListDateInputs = Array.from(document.querySelectorAll('.long-term-list-date-filter input'));
let statisticsCalendarStartMonth = new Date(2026, 6, 1);
let statisticsSelectionPhase = 'start';

function closeLongTermStatisticsPanel() {
  longTermStatisticsPanel.hidden = true;
  longTermStatisticsTrigger.setAttribute('aria-expanded', 'false');
}

function resetLongTermStatisticsDraft() {
  longTermStatisticsStartInput.value = longTermStatisticsStartLabel.textContent.trim();
  longTermStatisticsEndInput.value = longTermStatisticsEndLabel.textContent.trim();
  statisticsCalendarStartMonth = new Date(`${longTermStatisticsStartInput.value}T00:00:00`);
  statisticsCalendarStartMonth.setDate(1);
  statisticsSelectionPhase = 'start';
  renderLongTermStatisticsCalendars();
}

function formatStatisticsInputDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseStatisticsDate(value) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function renderStatisticsCalendarMonth(container, monthDate) {
  const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const gridStart = new Date(monthStart);
  gridStart.setDate(1 - monthStart.getDay());
  const rangeStart = parseStatisticsDate(longTermStatisticsStartInput.value);
  const rangeEnd = parseStatisticsDate(longTermStatisticsEndInput.value);
  container.innerHTML = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);
    const dateValue = formatStatisticsInputDate(date);
    const isCurrentMonth = date.getMonth() === monthDate.getMonth();
    const isStart = isCurrentMonth && dateValue === longTermStatisticsStartInput.value;
    const isEnd = isCurrentMonth && dateValue === longTermStatisticsEndInput.value;
    const isInRange = isCurrentMonth && date >= rangeStart && date <= rangeEnd;
    return `<button type="button" data-statistics-date="${dateValue}" class="${isCurrentMonth ? '' : 'is-outside'}${isInRange ? ' is-in-range' : ''}${isStart ? ' is-range-start' : ''}${isEnd ? ' is-range-end' : ''}">${date.getDate()}</button>`;
  }).join('');
}

function renderLongTermStatisticsCalendars() {
  const rightMonth = new Date(statisticsCalendarStartMonth.getFullYear(), statisticsCalendarStartMonth.getMonth() + 1, 1);
  longTermStatisticsLeftMonth.textContent = `${statisticsCalendarStartMonth.getFullYear()} - ${String(statisticsCalendarStartMonth.getMonth() + 1).padStart(2, '0')}`;
  longTermStatisticsRightMonth.textContent = `${rightMonth.getFullYear()} - ${String(rightMonth.getMonth() + 1).padStart(2, '0')}`;
  renderStatisticsCalendarMonth(longTermStatisticsLeftDays, statisticsCalendarStartMonth);
  renderStatisticsCalendarMonth(longTermStatisticsRightDays, rightMonth);
}

longTermStatisticsTrigger.addEventListener('click', () => {
  const willOpen = longTermStatisticsPanel.hidden;
  if (willOpen) resetLongTermStatisticsDraft();
  longTermStatisticsPanel.hidden = !willOpen;
  longTermStatisticsTrigger.setAttribute('aria-expanded', String(willOpen));
});

longTermStatisticsPanel.addEventListener('click', (event) => {
  const shortcut = event.target.closest('[data-statistics-range]');
  if (shortcut) {
    const endDate = new Date(2026, 6, 30);
    const startDate = new Date(endDate);
    if (shortcut.dataset.statisticsRange === 'yesterday') {
      startDate.setDate(startDate.getDate() - 1);
      endDate.setDate(endDate.getDate() - 1);
    } else if (shortcut.dataset.statisticsRange === 'last7') {
      startDate.setDate(startDate.getDate() - 6);
    } else if (shortcut.dataset.statisticsRange === 'last30') {
      startDate.setDate(startDate.getDate() - 29);
    } else if (shortcut.dataset.statisticsRange === 'thisMonth') {
      startDate.setDate(1);
    } else if (shortcut.dataset.statisticsRange === 'last7WithoutToday') {
      endDate.setDate(endDate.getDate() - 1);
      startDate.setDate(endDate.getDate() - 6);
    } else if (shortcut.dataset.statisticsRange === 'last30WithoutToday') {
      endDate.setDate(endDate.getDate() - 1);
      startDate.setDate(endDate.getDate() - 29);
    }
    longTermStatisticsStartInput.value = formatStatisticsInputDate(startDate);
    longTermStatisticsEndInput.value = formatStatisticsInputDate(endDate);
    statisticsCalendarStartMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    statisticsSelectionPhase = 'start';
    renderLongTermStatisticsCalendars();
    return;
  }

  const monthButton = event.target.closest('[data-statistics-month]');
  if (monthButton) {
    const monthAction = monthButton.dataset.statisticsMonth;
    const monthOffset = monthAction === 'previous' ? -1 : monthAction === 'next' ? 1 : monthAction === 'previousYear' ? -12 : 12;
    statisticsCalendarStartMonth = new Date(statisticsCalendarStartMonth.getFullYear(), statisticsCalendarStartMonth.getMonth() + monthOffset, 1);
    renderLongTermStatisticsCalendars();
    return;
  }

  const dateButton = event.target.closest('[data-statistics-date]');
  if (!dateButton) return;
  const selectedDate = dateButton.dataset.statisticsDate;
  if (statisticsSelectionPhase === 'start') {
    longTermStatisticsStartInput.value = selectedDate;
    longTermStatisticsEndInput.value = selectedDate;
    statisticsSelectionPhase = 'end';
  } else {
    if (selectedDate < longTermStatisticsStartInput.value) {
      longTermStatisticsEndInput.value = longTermStatisticsStartInput.value;
      longTermStatisticsStartInput.value = selectedDate;
    } else {
      longTermStatisticsEndInput.value = selectedDate;
    }
    statisticsSelectionPhase = 'start';
  }
  renderLongTermStatisticsCalendars();
});

longTermStatisticsCancel.addEventListener('click', () => {
  resetLongTermStatisticsDraft();
  closeLongTermStatisticsPanel();
});

longTermStatisticsConfirm.addEventListener('click', () => {
  if (!longTermStatisticsStartInput.value || !longTermStatisticsEndInput.value) return;
  if (longTermStatisticsStartInput.value > longTermStatisticsEndInput.value) {
    longTermStatisticsEndInput.value = longTermStatisticsStartInput.value;
  }
  longTermStatisticsStartLabel.textContent = longTermStatisticsStartInput.value;
  longTermStatisticsEndLabel.textContent = longTermStatisticsEndInput.value;
  syncDrawerStatisticsPeriod();
  closeLongTermStatisticsPanel();
  renderTable();
});

document.addEventListener('click', (event) => {
  if (!longTermStatisticsPicker.contains(event.target)) closeLongTermStatisticsPanel();
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
const statisticsColumnCategorySelectAll = document.querySelector('#statistics-column-category-select-all');
const statisticsSelectedColumnPanelCount = document.querySelector('#statistics-selected-column-panel-count');
const statisticsResetSelectedColumnsButton = document.querySelector('#statistics-reset-selected-columns');
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
let selectedStatisticsOrderType = '';
const statisticsColumnFields = Array.from(document.querySelectorAll('#delivery-statistics-page .statistics-table thead th'))
  .map((cell) => cell.textContent.replace('?', '').trim());
let savedStatisticsColumns = [...statisticsColumnFields];
let draftStatisticsColumns = [...savedStatisticsColumns];
let draggedStatisticsColumn = '';

function renderStatisticsColumnSettings() {
  const keyword = statisticsColumnSearch.value.trim().toLowerCase();
  const visibleFields = statisticsColumnFields.filter((field) => field.toLowerCase().includes(keyword));
  statisticsColumnOptions.innerHTML = visibleFields.length ? visibleFields.map((field) => `
    <label class="statistics-column-option">
      <input type="checkbox" value="${field}" ${draftStatisticsColumns.includes(field) ? 'checked' : ''}>
      <span>${field}</span>
    </label>
  `).join('') : `<div class="statistics-column-empty">${keyword ? '暂无匹配指标' : '暂无指标'}</div>`;

  statisticsSelectedColumns.innerHTML = draftStatisticsColumns.length ? draftStatisticsColumns.map((field) => `
    <div class="statistics-selected-column" draggable="true" data-statistics-column="${field}">
      <span class="statistics-column-drag" aria-hidden="true">☰</span>
      <span>${field}</span>
      <button type="button" data-remove-statistics-column="${field}" aria-label="移除${field}">×</button>
    </div>
  `).join('') : `
    <div class="statistics-selected-column-empty">
      <span>暂无已选指标</span>
      <p>请从左侧勾选需要展示的指标</p>
    </div>
  `;

  statisticsSelectedColumnPanelCount.textContent = String(draftStatisticsColumns.length);
  statisticsResetSelectedColumnsButton.disabled =
    draftStatisticsColumns.length === statisticsColumnFields.length
    && draftStatisticsColumns.every((field, index) => field === statisticsColumnFields[index]);
  statisticsClearSelectedColumnsButton.disabled = draftStatisticsColumns.length === 0;
  statisticsColumnCategorySelectAll.hidden = Boolean(keyword);
  statisticsColumnCategorySelectAll.checked = draftStatisticsColumns.length === statisticsColumnFields.length;
  statisticsColumnCategorySelectAll.indeterminate =
    draftStatisticsColumns.length > 0 && !statisticsColumnCategorySelectAll.checked;
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
statisticsColumnCategorySelectAll.addEventListener('change', () => {
  draftStatisticsColumns = statisticsColumnCategorySelectAll.checked ? [...statisticsColumnFields] : [];
  renderStatisticsColumnSettings();
});
statisticsResetSelectedColumnsButton.addEventListener('click', () => {
  const isDefaultConfiguration =
    draftStatisticsColumns.length === statisticsColumnFields.length
    && draftStatisticsColumns.every((field, index) => field === statisticsColumnFields[index]);
  if (isDefaultConfiguration) return;
  draftStatisticsColumns = [...statisticsColumnFields];
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
  statisticsOrderTypeLabel.textContent = selectedStatisticsOrderType || '选择计划类型';
  statisticsOrderTypeTrigger.classList.toggle('has-value', Boolean(selectedStatisticsOrderType));
}

function closeStatisticsOrderTypeFilter() {
  statisticsOrderTypePanel.hidden = true;
  statisticsOrderTypeTrigger.setAttribute('aria-expanded', 'false');
}

function renderStatisticsRows() {
  document.querySelectorAll('#delivery-statistics-page .statistics-table tbody tr').forEach((row) => {
    row.hidden = Boolean(selectedStatisticsOrderType) && row.dataset.orderType !== selectedStatisticsOrderType;
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
  selectedStatisticsOrderType = selectedStatisticsOrderType === planType ? '' : planType;
  statisticsOrderTypeOptions.forEach((candidate) => {
    const isSelected = candidate.dataset.statisticsOrderType === selectedStatisticsOrderType;
    candidate.classList.toggle('is-selected', isSelected);
    candidate.setAttribute('aria-pressed', String(isSelected));
  });
  updateStatisticsOrderTypeLabel();
  closeStatisticsOrderTypeFilter();
  renderStatisticsRows();
});

statisticsResetButton.addEventListener('click', () => {
  selectedStatisticsOrderType = '';
  statisticsOrderTypeOptions.forEach((option) => {
    option.classList.remove('is-selected');
    option.setAttribute('aria-pressed', 'false');
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
const mainTrendDateValues = [longTermStatisticsStartLabel, longTermStatisticsEndLabel];
const mainTrendSeries = [
  { key: 'spend', label: '总消耗金额', className: 'consume', color: '#2e73ff', axis: 'left', format: (value) => value.toFixed(2).replace(/\.00$/, '') },
  { key: 'orders', label: '总成交订单数', className: 'order', color: '#ff8b28', axis: 'left', format: (value) => String(value) },
  { key: 'amount', label: '总成交金额', className: 'amount', color: '#42bd7b', axis: 'left', format: (value) => value.toFixed(2).replace(/\.00$/, '') },
  { key: 'roi', label: '总成交ROI', className: 'roi', color: '#ff5b62', axis: 'right', format: (value) => value.toFixed(2).replace(/\.00$/, '') }
];
let mainTrendMode = 'day';
let mainTrendPoints = [];
let mainTrendViewWidth = 1000;

function parseMainTrendDate(dateText) {
  return new Date(`${dateText.slice(0, 10)}T00:00:00`);
}

function formatMainTrendDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getMainTrendDateRange() {
  const startText = mainTrendDateValues[0]?.textContent.trim() || '2026-07-13 00:00:00';
  const endText = mainTrendDateValues[1]?.textContent.trim() || startText;
  const startDate = parseMainTrendDate(startText);
  const endDate = parseMainTrendDate(endText);
  return startDate <= endDate ? { startDate, endDate } : { startDate: endDate, endDate: startDate };
}

function getMainTrendDays() {
  const { startDate, endDate } = getMainTrendDateRange();
  const days = [];
  const current = new Date(startDate);
  while (current <= endDate && days.length < 60) {
    days.push(formatMainTrendDate(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
}

function buildMainTrendDayData() {
  return getMainTrendDays().map((date, index, rows) => {
    if (rows.length === 1) {
      return { time: date, spend: 42.80, orders: 8, amount: 38.20, roi: 0.89 };
    }
    const progress = rows.length === 1 ? 1 : index / (rows.length - 1);
    const peak = Math.max(0, 1 - Math.abs(progress - 0.72) * 9);
    const baseline = 8 + Math.sin(index * 0.9) * 3;
    const spend = Number((baseline + peak * 207).toFixed(2));
    const orders = Math.max(1, Math.round(1 + peak * 7));
    const amount = Number((baseline * 0.8 + peak * 179).toFixed(2));
    return { time: date, spend, orders, amount, roi: spend ? Number((amount / spend).toFixed(2)) : 0 };
  });
}

function buildMainTrendHourData() {
  const days = getMainTrendDays();
  const focusDayIndex = Math.max(0, Math.min(days.length - 1, Math.floor(days.length * 0.72)));
  const firstPeakIndex = focusDayIndex * 24 + 12;
  const secondPeakIndex = focusDayIndex * 24 + 48;
  return days.flatMap((date, dayIndex) => Array.from({ length: 24 }, (_, hour) => {
    const currentIndex = dayIndex * 24 + hour;
    const firstPeak = Math.exp(-Math.pow(currentIndex - firstPeakIndex, 2) / 60);
    const secondPeak = Math.exp(-Math.pow(currentIndex - secondPeakIndex, 2) / 60);
    const intensity = Math.min(1, firstPeak + secondPeak);
    const visibleIntensity = intensity < 0.01 ? 0 : intensity;
    const spend = Number((visibleIntensity * 30.8).toFixed(2));
    const orders = Math.round(visibleIntensity * 2);
    const amount = Number((visibleIntensity * 26).toFixed(2));
    return {
      time: `${date} ${String(hour).padStart(2, '0')}:00`,
      spend,
      orders,
      amount,
      roi: spend ? Number((amount / spend).toFixed(2)) : 0
    };
  }));
}

function getMainTrendRows() {
  return mainTrendMode === 'day' ? buildMainTrendDayData() : buildMainTrendHourData();
}

function getMainTrendScale(rows) {
  const leftSeries = mainTrendSeries.filter((series) => series.axis === 'left');
  const leftMaximum = Math.max(1, ...rows.flatMap((row) => leftSeries.map((series) => Number(row[series.key]) || 0)));
  const roiMaximum = Math.max(1, ...rows.map((row) => Number(row.roi) || 0));
  return {
    leftMaximum: Math.ceil(leftMaximum / 50) * 50,
    roiMaximum: Math.ceil(roiMaximum * 10) / 10
  };
}

function formatMainTrendHoverTime(time) {
  if (mainTrendMode === 'day') return time;
  const [date, hourText] = time.split(' ');
  const startHour = Number(hourText.slice(0, 2));
  const endHour = (startHour + 1) % 24;
  return `${date} ${startHour}:00~${endHour}:00`;
}

function formatMainTrendAxisTime(time, index, total) {
  if (mainTrendMode === 'day') return time.slice(5);
  const [date, hourText] = time.split(' ');
  const hour = Number(hourText.slice(0, 2));
  return index === 0 || index === total - 1 ? `${date.slice(5).replace('-', '/')} ${hour}:00` : `${hour}:00`;
}

function getMainTrendLabelIndexes(total, plotWidth) {
  if (total <= 1) return new Set([0]);
  if (mainTrendMode === 'day') {
    const labelCount = Math.max(2, Math.min(30, total, Math.floor(plotWidth / 48)));
    return new Set(Array.from({ length: labelCount }, (_, index) => Math.round(index * (total - 1) / (labelCount - 1))));
  }
  if (total <= 24) {
    return new Set(Array.from({ length: Math.ceil(total / 2) }, (_, index) => index * 2).filter((index) => index < total));
  }
  const labelCount = Math.max(2, Math.min(12, Math.floor(plotWidth / 110)));
  return new Set(Array.from({ length: labelCount }, (_, index) => Math.round(index * (total - 1) / (labelCount - 1))));
}

function buildMainTrendCurve(points) {
  if (points.length < 2) return points.length ? `M ${points[0][0]} ${points[0][1]}` : '';
  return points.reduce((path, point, index) => {
    if (index === 0) return `M ${point[0]} ${point[1]}`;
    const previous = points[index - 1];
    const controlX = (previous[0] + point[0]) / 2;
    return `${path} C ${controlX} ${previous[1]}, ${controlX} ${point[1]}, ${point[0]} ${point[1]}`;
  }, '');
}

function renderMainTrend() {
  const rows = getMainTrendRows();
  mainTrendViewWidth = Math.max(720, Math.round(mainTrendChart.clientWidth || 1000));
  mainTrendSvg.setAttribute('viewBox', `0 0 ${mainTrendViewWidth} 240`);
  const left = 44;
  const right = mainTrendViewWidth - 44;
  const top = 14;
  const bottom = 198;
  const { leftMaximum, roiMaximum } = getMainTrendScale(rows);
  mainTrendPoints = rows.map((row, index) => ({
    row,
    x: left + ((right - left) * index / Math.max(1, rows.length - 1))
  }));
  const gridMarkup = Array.from({ length: 6 }, (_, index) => {
    const ratio = index / 5;
    const y = bottom - ratio * (bottom - top);
    const leftValue = Math.round(leftMaximum * ratio);
    const rightValue = (roiMaximum * ratio).toFixed(1).replace(/\.0$/, '');
    return `<line class="trend-grid-line" x1="${left}" y1="${y}" x2="${right}" y2="${y}"></line>
      <text class="trend-y-label trend-y-label-left" x="${left - 8}" y="${y + 4}">${leftValue}</text>
      <text class="trend-y-label trend-y-label-right" x="${right + 8}" y="${y + 4}">${rightValue}</text>`;
  }).join('');
  const seriesMarkup = mainTrendSeries.map((series) => {
    const maximum = series.axis === 'right' ? roiMaximum : leftMaximum;
    const points = mainTrendPoints.map(({ row, x }) => [x, bottom - ((Number(row[series.key]) || 0) / maximum) * (bottom - top)]);
    const singlePoint = points.length === 1 ? `<circle class="trend-static-point trend-series-${series.className}" cx="${points[0][0]}" cy="${points[0][1]}" r="3"></circle>` : '';
    return `<path class="trend-series trend-series-${series.className}" d="${buildMainTrendCurve(points)}"></path>${singlePoint}`;
  }).join('');
  const labelIndexes = getMainTrendLabelIndexes(mainTrendPoints.length, right - left);
  const labels = mainTrendPoints.map(({ row, x }, index) => {
    const showLabel = labelIndexes.has(index);
    return showLabel ? `<text class="trend-axis-label" x="${x}" y="225">${formatMainTrendAxisTime(row.time, index, mainTrendPoints.length)}</text>` : '';
  }).join('');
  mainTrendSvg.innerHTML = `${gridMarkup}${seriesMarkup}${labels}<g id="main-trend-hover" visibility="hidden"><line class="trend-hover-line" x1="0" y1="${top}" x2="0" y2="${bottom}"></line>${mainTrendSeries.map((series) => `<circle class="trend-hover-point trend-series-${series.className}" cx="0" cy="0" r="4"></circle>`).join('')}</g>`;
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
  const viewX = (event.clientX - bounds.left) / bounds.width * mainTrendViewWidth;
  const nearest = mainTrendPoints.reduce((best, point, index) => Math.abs(point.x - viewX) < Math.abs(best.point.x - viewX) ? { point, index } : best, { point: mainTrendPoints[0], index: 0 });
  const hoverGroup = mainTrendSvg.querySelector('#main-trend-hover');
  hoverGroup.setAttribute('visibility', 'visible');
  const { leftMaximum, roiMaximum } = getMainTrendScale(mainTrendPoints.map(({ row }) => row));
  hoverGroup.querySelector('line').setAttribute('x1', nearest.point.x);
  hoverGroup.querySelector('line').setAttribute('x2', nearest.point.x);
  hoverGroup.querySelectorAll('circle').forEach((circle, index) => {
    const series = mainTrendSeries[index];
    const maximum = series.axis === 'right' ? roiMaximum : leftMaximum;
    circle.setAttribute('cx', nearest.point.x);
    circle.setAttribute('cy', 198 - ((Number(nearest.point.row[series.key]) || 0) / maximum) * 184);
  });
  mainTrendTooltip.innerHTML = `<strong>${formatMainTrendHoverTime(nearest.point.row.time)}</strong>${mainTrendSeries.map((series) => `<span style="--tooltip-color:${series.color}">${series.label}：${series.format(nearest.point.row[series.key])}</span>`).join('')}`;
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

if (mainTrendDateValues.length === 2) {
  const mainTrendDateObserver = new MutationObserver(() => renderMainTrend());
  mainTrendDateValues.forEach((item) => mainTrendDateObserver.observe(item, { childList: true, characterData: true, subtree: true }));
}

if ('ResizeObserver' in window) {
  const mainTrendResizeObserver = new ResizeObserver(() => renderMainTrend());
  mainTrendResizeObserver.observe(mainTrendChart);
}

const columnGroups = [
  {
    name: '投放参数',
    fields: [
      '投放号', '每日预算', '优先提升目标', '加热方式', '出价/目标ROI', '加热素材',
      '计划分组', '数据更新时间', '计划终止时间', '创建时间', '计划加热时长'
    ]
  },
  {
    name: '投放消耗',
    fields: ['今日消耗金额/进度', '周期内消耗金额/进度']
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
      '直播间曝光人数', '短视频曝光总人数', '总进入人数', '进入直播间观看人数',
      '短视频进入人数', 'GPM', '下单成本', '进入直播间观看人次', '短视频观看人次'
    ]
  },
  {
    name: '长周期转化',
    fields: []
  }
];

// 列表和字段定义弹窗统一采用已确认的长期计划最终字段顺序。
const businessColumns = [
  '投放号', '每日预算', '今日消耗金额/进度', '周期内消耗金额/进度',
  '优先提升目标', '加热方式', '出价/目标ROI', '加热素材', '计划分组',
  '数据更新时间', '计划终止时间', '创建时间', '计划加热时长',
  '短视频评论次数', '总评论次数', '新增关注数', '总点赞次数', '直播间点赞次数', '短视频点赞次数',
  '直播间新增粉丝数', '短视频新增粉丝数', '直播间评论次数', '总成交ROI', '总成交金额', '总成交订单数',
  '总曝光人数', '商品点击次数', '商品点击率', '点击成交率', '千展费用', '点击成本', '转化成本', '进入成本',
  '商品点击人数', '当场下单订单数', '当场下单 ROI', '下单人数', '成交人数', '利润', '进入率', '直播间曝光人数',
  '短视频曝光总人数', '总进入人数', '进入直播间观看人数', '短视频进入人数', 'GPM', '下单成本', '进入直播间观看人次', '短视频观看人次'
];

const planRows = [
  { name: '测试支付码', id: '1783612800_1096390', targetAccount: 'tel小小店非正式账号', dailyBudget: 2000, todaySpend: 126.50, averageDailySpend: 118.60, totalSpend: 1654.80, planDays: 30, endTime: '2026-07-14 09:44:52', createdTime: '2026-07-13 17:49:14', deliveryState: 'unauthorized' },
  { name: '产品测试，花光所有的豆...', id: '1783526400_1862699', targetAccount: 'tel小小店非正式账号', dailyBudget: 1000, todaySpend: 83.20, averageDailySpend: 91.40, totalSpend: 1289.60, planDays: 30, endTime: '2026-07-13 17:24:55', createdTime: '2026-07-13 17:05:29', deliveryState: 'pending' },
  { name: '产品测试，花光所有的豆...', id: '1783440000_1765763', targetAccount: 'tel小小店非正式账号', dailyBudget: 1000, todaySpend: 0, averageDailySpend: 76.80, totalSpend: 986.30, planDays: 21, endTime: '2026-07-13 17:04:18', createdTime: '2026-07-13 17:02:37', deliveryState: 'active' },
  { name: '[7.6复投]主力计划0703-6...', id: '1783440000_1703702', targetAccount: 'tel小小店非正式账号', dailyBudget: 200, todaySpend: 35.80, averageDailySpend: 31.20, totalSpend: 486.50, planDays: 30, endTime: '2026-07-13 16:45:32', createdTime: '2026-07-13 16:40:18', deliveryState: 'paused' },
  { name: '202607071859微信豆计...', id: '1783353600_1680459', targetAccount: 'tel小小店非正式账号', dailyBudget: 2000, todaySpend: 210.00, averageDailySpend: 198.40, totalSpend: 3268.90, planDays: 30, endTime: '2026-07-13 16:18:46', createdTime: '2026-07-13 16:12:09', deliveryState: 'closed' },
  { name: '审核中计划示例', id: '1783267200_1679128', targetAccount: 'tel小小店非正式账号', dailyBudget: 500, todaySpend: 0, averageDailySpend: 0, totalSpend: 0, planDays: 14, endTime: '2026-07-13 15:58:20', createdTime: '2026-07-13 15:52:11', deliveryState: 'reviewing' },
  { name: '结算中计划示例', id: '1783180800_1668042', targetAccount: 'tel小小店非正式账号', dailyBudget: 800, todaySpend: 68.40, averageDailySpend: 72.10, totalSpend: 895.70, planDays: 21, endTime: '2026-07-13 15:26:44', createdTime: '2026-07-13 15:20:06', deliveryState: 'settling' },
  { name: '已取消计划示例', id: '1783094400_1657391', targetAccount: 'tel小小店非正式账号', dailyBudget: 300, todaySpend: 0, averageDailySpend: 18.20, totalSpend: 236.40, planDays: 14, endTime: '2026-07-13 14:48:31', createdTime: '2026-07-13 14:42:17', deliveryState: 'canceled' }
];

const percentFields = new Set(['商品点击率', '点击成交率', '进入率']);
const amountFields = new Set([
  '每日预算', '总成交金额', '千展费用',
  '点击成本', '转化成本', '进入成本', '利润', 'GPM', '下单成本'
]);
const numberFields = new Set([
  '每日预算', '总成交ROI', '总成交金额', '总成交订单数', '总曝光人数', '总评论次数', '短视频评论次数', '新增关注数',
  '商品点击次数', '千展费用', '点击成本', '转化成本', '进入成本', '商品点击人数', '当场下单订单数', '当场下单 ROI',
  '下单人数', '成交人数', '利润', '直播间曝光人数', '短视频曝光总人数', '总点赞次数', '直播间点赞次数',
  '短视频点赞次数', '直播间新增粉丝数', '短视频新增粉丝数', '直播间评论次数', '总进入人数',
  '进入直播间观看人数', '短视频进入人数', 'GPM', '下单成本', '进入直播间观看人次', '短视频观看人次'
]);

let selectedColumnOrder = [...businessColumns];
let draftColumnOrder = [...businessColumns];
const sortablePlanFields = new Set(['每日预算', '今日消耗金额/进度', '周期内消耗金额/进度']);
const planFieldTooltips = {
  '今日消耗金额/进度': '今日自然日产生的消耗；进度＝今日消耗金额÷每日预算。',
  '周期内消耗金额/进度': '顶部“统计时间”范围内产生的消耗；进度＝周期内消耗金额÷周期内应投预算。'
};
let activePlanSortField = '';
let activePlanSortDirection = 'desc';
const tableHead = document.querySelector('#plan-table-head');
const tableBody = document.querySelector('#plan-table-body');
const planFieldTooltip = document.querySelector('#plan-field-tooltip');
const batchActions = document.querySelector('#batch-actions');
const settingsButton = document.querySelector('#column-settings-button');
const settingsPanel = document.querySelector('#column-settings-panel');
const settingsList = document.querySelector('#column-settings-list');
const selectedColumnList = document.querySelector('#selected-column-list');
const selectedColumnPanelCount = document.querySelector('#selected-column-panel-count');
const resetSelectedColumnsButton = document.querySelector('#reset-selected-columns');
const clearSelectedColumnsButton = document.querySelector('#clear-selected-columns');
const searchInput = document.querySelector('#column-search-input');
const categoryList = document.querySelector('#picker-category-list');
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
  if (field === '每日预算') return `￥${Number(row.dailyBudget).toFixed(2)}`;
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
  if (field === '今日消耗金额/进度' || field === '周期内消耗金额/进度') {
    const statisticsStart = parseStatisticsDate(longTermStatisticsStartLabel.textContent.trim());
    const statisticsEnd = parseStatisticsDate(longTermStatisticsEndLabel.textContent.trim());
    const statisticsDays = Math.max(1, Math.round((statisticsEnd - statisticsStart) / 86400000) + 1);
    const amount = field === '今日消耗金额/进度'
      ? Number(row.todaySpend)
      : Number(row.averageDailySpend) * statisticsDays;
    const budget = field === '今日消耗金额/进度'
      ? Number(row.dailyBudget)
      : Number(row.dailyBudget) * statisticsDays;
    const amountText = amount.toFixed(2);
    const progressValue = Math.min(100, Math.max(0, budget ? (amount / budget) * 100 : 0));
    const progressText = `${progressValue.toFixed(2)}%`;
    return `<div class="amount-value">￥${amountText}</div><div class="spend-progress"><span class="spend-progress-track"><i style="width: ${progressValue}%"></i></span><span>${progressText}</span></div>`;
  }
  if (field === '计划加热时长') return '18天';
  return getFieldValue(field, row);
}

function getDeliveryStateText(state) {
  if (state === 'unauthorized') return '未授权代扣';
  if (state === 'pending') return '待加热';
  if (state === 'reviewing') return '审核中';
  if (state === 'settling') return '结算中';
  if (state === 'paused') return '已暂停';
  if (state === 'closed') return '已完成';
  if (state === 'canceled') return '已取消';
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
  const adjustAction = `<button class="row-action-button" type="button" data-adjust-plan="${rowIndex}">调整</button>`;
  const redeliverAction = `<button class="row-action-button" type="button" data-redeliver="${rowIndex}">复投</button>`;
  if (row.deliveryState === 'paused') {
    return `<div class="row-actions">${dataAction}&nbsp; ${adjustAction}&nbsp; <button class="row-action-button" type="button" data-toggle-status="${rowIndex}">恢复</button>&nbsp; ${redeliverAction}</div>`;
  }
  if (row.deliveryState === 'pending') {
    return `<div class="row-actions">${dataAction}&nbsp; <button class="row-action-button" type="button" data-close-delivery="${rowIndex}">终止</button>&nbsp; ${adjustAction}&nbsp; <button class="row-action-button" type="button" data-toggle-status="${rowIndex}">暂停</button>&nbsp; ${redeliverAction}</div>`;
  }
  if (row.deliveryState === 'active' || row.deliveryState === 'reviewing') {
    return `<div class="row-actions">${dataAction}&nbsp; <button class="row-action-button" type="button" data-close-delivery="${rowIndex}">终止</button>&nbsp; <button class="row-action-button" type="button" data-toggle-status="${rowIndex}">暂停</button>&nbsp; ${redeliverAction}</div>`;
  }
  return `<div class="row-actions">${dataAction}&nbsp; ${redeliverAction}</div>`;
}

function getPlanFieldSortValue(field, row) {
  if (field === '每日预算') return Number(row.dailyBudget);
  if (field === '今日消耗金额/进度') return Number(row.todaySpend);
  if (field === '周期内消耗金额/进度') {
    const statisticsStart = parseStatisticsDate(longTermStatisticsStartLabel.textContent.trim());
    const statisticsEnd = parseStatisticsDate(longTermStatisticsEndLabel.textContent.trim());
    const statisticsDays = Math.max(1, Math.round((statisticsEnd - statisticsStart) / 86400000) + 1);
    return Number(row.averageDailySpend) * statisticsDays;
  }
  return 0;
}

function renderPlanFieldHeader(field) {
  const tooltip = planFieldTooltips[field]
    ? `<span class="tab-help effect-help plan-column-help" tabindex="0" aria-label="${planFieldTooltips[field]}" data-tooltip="${planFieldTooltips[field]}">?</span>`
    : '';
  if (!sortablePlanFields.has(field)) return `${field}${tooltip}`;
  const isActive = activePlanSortField === field;
  const sortClass = isActive ? ` is-active is-${activePlanSortDirection}` : '';
  return `<button class="plan-sort-button${sortClass}" type="button" data-plan-sort="${field}">${field}<span aria-hidden="true"></span></button>${tooltip}`;
}

function showPlanFieldTooltip(target) {
  planFieldTooltip.textContent = target.dataset.tooltip;
  planFieldTooltip.hidden = false;
  const targetRect = target.getBoundingClientRect();
  const tooltipRect = planFieldTooltip.getBoundingClientRect();
  const left = Math.min(window.innerWidth - tooltipRect.width - 12, Math.max(12, targetRect.right - tooltipRect.width + 18));
  const top = Math.max(12, targetRect.top - tooltipRect.height - 13);
  const arrowLeft = Math.min(tooltipRect.width - 18, Math.max(18, targetRect.left + targetRect.width / 2 - left));
  planFieldTooltip.style.left = `${left}px`;
  planFieldTooltip.style.top = `${top}px`;
  planFieldTooltip.style.setProperty('--tooltip-arrow-left', `${arrowLeft}px`);
}

function hidePlanFieldTooltip() {
  planFieldTooltip.hidden = true;
}

function renderTable() {
  const visibleColumns = selectedColumnOrder;
  const visibleRows = planRows.map((row, rowIndex) => ({ row, rowIndex }))
    .filter(({ row }) => !planStatusFilter.value || row.deliveryState === planStatusFilter.value);
  if (activePlanSortField) {
    visibleRows.sort((firstItem, secondItem) => {
      const result = getPlanFieldSortValue(activePlanSortField, firstItem.row) - getPlanFieldSortValue(activePlanSortField, secondItem.row);
      return activePlanSortDirection === 'asc' ? result : -result;
    });
  }
  const allRowsSelected = planRows.length > 0 && selectedPlanIds.size === planRows.length;
  const someRowsSelected = selectedPlanIds.size > 0 && !allRowsSelected;
  tableHead.innerHTML = `
    <th class="check-column"><button class="checkbox${allRowsSelected ? ' is-selected' : ''}${someRowsSelected ? ' is-indeterminate' : ''}" type="button" data-select-all role="checkbox" aria-checked="${someRowsSelected ? 'mixed' : String(allRowsSelected)}" aria-label="${allRowsSelected ? '取消全选' : '全选'}"></button></th>
    <th class="plan-column">计划名称/ID</th>
    <th class="status-column">状态/操作</th>
    <th class="target-account-column">被投号</th>
    ${visibleColumns.map((field) => `<th class="business-column" data-field="${field}" aria-sort="${activePlanSortField === field ? (activePlanSortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}">${renderPlanFieldHeader(field)}</th>`).join('')}
  `;

  tableBody.innerHTML = visibleRows.map(({ row, rowIndex }) => `
    <tr class="${selectedPlanIds.has(row.id) ? 'is-selected' : ''}">
      <td><button class="checkbox${selectedPlanIds.has(row.id) ? ' is-selected' : ''}" type="button" data-select-row="${row.id}" role="checkbox" aria-checked="${String(selectedPlanIds.has(row.id))}" aria-label="选择计划${row.name}"></button></td>
      <td class="plan-column"><div class="plan-name">${row.name}</div><div class="plan-id">ID: ${row.id}</div></td>
      <td class="status-column"><span class="status-tag status-tag-${row.deliveryState}">${getDeliveryStateText(row.deliveryState)}</span>${renderRowActions(row, rowIndex)}</td>
      <td class="target-account-column"><div class="target-account"><span class="target-account-avatar">豆</span><span>${row.targetAccount}</span></div></td>
      ${visibleColumns.map((field) => `<td class="business-column" data-field="${field}">${renderBusinessCell(field, row)}</td>`).join('')}
    </tr>
  `).join('');
  batchActions.hidden = selectedPlanIds.size === 0;
}

planStatusFilter.addEventListener('change', renderTable);
longTermFilterReset.addEventListener('click', () => {
  planStatusFilter.value = '';
  longTermListDateInputs.forEach((input) => {
    input.value = '';
  });
  renderTable();
});

function renderColumnSettings(query = '') {
  const normalizedQuery = query.trim().toLowerCase();
  const renderFields = (fields) => fields.length ? fields.map((field) => `
      <label class="column-setting-item">
        <input type="checkbox" value="${field}" ${draftColumnOrder.includes(field) ? 'checked' : ''}>
        <span>${field}</span>
      </label>
    `).join('') : `<div class="column-settings-empty">${normalizedQuery ? '暂无匹配字段' : '暂无指标'}</div>`;

  if (normalizedQuery) {
    const matchedGroups = columnGroups
      .map((group) => ({
        ...group,
        fields: group.fields.filter((field) => field.toLowerCase().includes(normalizedQuery))
      }))
      .filter((group) => group.fields.length);
    settingsList.innerHTML = matchedGroups.length ? matchedGroups.map((group) => `
      <section class="column-settings-section is-search-results"
        data-column-section="${group.name}">
        <div class="picker-section-title"><span>${group.name}</span></div>
        <div class="column-settings-grid">${renderFields(group.fields)}</div>
      </section>
    `).join('') : `<div class="column-settings-empty">暂无匹配字段</div>`;
    if (matchedGroups.length) {
      activeColumnGroup = matchedGroups[0].name;
      renderColumnCategories();
    }
    return;
  }

  settingsList.innerHTML = columnGroups.map((group) => {
    const selectedGroupFieldCount =
      group.fields.filter((field) => draftColumnOrder.includes(field)).length;
    const isAllSelected =
      group.fields.length > 0 && selectedGroupFieldCount === group.fields.length;
    return `
      <section class="column-settings-section" data-column-section="${group.name}">
        <label class="picker-section-title">
          <input type="checkbox" data-select-group="${group.name}"
            ${isAllSelected ? 'checked' : ''}
            aria-label="全选${group.name}分类字段">
          <span>${group.name}</span>
        </label>
        <div class="column-settings-grid">${renderFields(group.fields)}</div>
      </section>
    `;
  }).join('');

  settingsList.querySelectorAll('[data-select-group]').forEach((checkbox) => {
    const group = columnGroups.find((item) => item.name === checkbox.dataset.selectGroup);
    const selectedGroupFieldCount =
      group.fields.filter((field) => draftColumnOrder.includes(field)).length;
    checkbox.indeterminate =
      selectedGroupFieldCount > 0 && selectedGroupFieldCount < group.fields.length;
  });
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
      <span>暂无已选指标</span>
      <p>请从左侧勾选需要展示的指标</p>
    </div>
  `;
  selectedColumnPanelCount.textContent = String(draftColumnOrder.length);
  resetSelectedColumnsButton.disabled =
    draftColumnOrder.length === businessColumns.length
    && draftColumnOrder.every((field, index) => field === businessColumns[index]);
  clearSelectedColumnsButton.disabled = draftColumnOrder.length === 0;
}

function refreshSettings(preserveFieldScroll = false) {
  const previousFieldScrollTop = settingsList.scrollTop;
  renderColumnCategories();
  renderColumnSettings(searchInput.value);
  renderSelectedColumns();
  if (preserveFieldScroll) settingsList.scrollTop = previousFieldScrollTop;
}

function closeSettings() {
  settingsPanel.hidden = true;
  settingsButton.setAttribute('aria-expanded', 'false');
}

settingsList.addEventListener('change', (event) => {
  const checkbox = event.target;
  if (!(checkbox instanceof HTMLInputElement)) return;
  if (checkbox.matches('[data-select-group]')) {
    const group = columnGroups.find((item) => item.name === checkbox.dataset.selectGroup);
    if (!group) return;
    if (checkbox.checked) {
      group.fields.forEach((field) => {
        if (!draftColumnOrder.includes(field)) draftColumnOrder.push(field);
      });
    } else {
      draftColumnOrder = draftColumnOrder.filter((field) => !group.fields.includes(field));
    }
    refreshSettings(true);
    return;
  }
  if (checkbox.checked && !draftColumnOrder.includes(checkbox.value)) draftColumnOrder.push(checkbox.value);
  if (!checkbox.checked) draftColumnOrder = draftColumnOrder.filter((field) => field !== checkbox.value);
  refreshSettings(true);
});

clearSelectedColumnsButton.addEventListener('click', () => {
  if (draftColumnOrder.length === 0) return;
  draftColumnOrder = [];
  refreshSettings(true);
});

resetSelectedColumnsButton.addEventListener('click', () => {
  const isDefaultConfiguration =
    draftColumnOrder.length === businessColumns.length
    && draftColumnOrder.every((field, index) => field === businessColumns[index]);
  if (isDefaultConfiguration) return;
  draftColumnOrder = [...businessColumns];
  refreshSettings(true);
});

searchInput.addEventListener('input', () => renderColumnSettings(searchInput.value));

categoryList.addEventListener('click', (event) => {
  const categoryButton = event.target.closest('[data-column-group]');
  if (!categoryButton) return;
  const targetGroup = categoryButton.dataset.columnGroup;
  const section = Array.from(settingsList.querySelectorAll('[data-column-section]'))
    .find((item) => item.dataset.columnSection === targetGroup);
  if (!section) return;
  activeColumnGroup = targetGroup;
  renderColumnCategories();
  const targetTop =
    section.getBoundingClientRect().top
    - settingsList.getBoundingClientRect().top
    + settingsList.scrollTop;
  settingsList.scrollTo({ top: targetTop, behavior: 'smooth' });
});

settingsList.addEventListener('scroll', () => {
  const sections = Array.from(settingsList.querySelectorAll('[data-column-section]'));
  if (!sections.length) return;
  let currentSection = sections[0];
  const listTop = settingsList.getBoundingClientRect().top + 8;
  sections.forEach((section) => {
    if (section.getBoundingClientRect().top <= listTop) currentSection = section;
  });
  if (settingsList.scrollTop + settingsList.clientHeight >= settingsList.scrollHeight - 2) {
    currentSection = sections[sections.length - 1];
  }
  const nextActiveGroup = currentSection.dataset.columnSection;
  if (nextActiveGroup === activeColumnGroup) return;
  activeColumnGroup = nextActiveGroup;
  renderColumnCategories();
});

selectedColumnList.addEventListener('click', (event) => {
  const removeButton = event.target.closest('[data-remove-field]');
  if (!removeButton) return;
  draftColumnOrder = draftColumnOrder.filter((field) => field !== removeButton.dataset.removeField);
  refreshSettings(true);
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
  const sortButton = event.target.closest('[data-plan-sort]');
  if (sortButton) {
    const nextField = sortButton.dataset.planSort;
    if (activePlanSortField === nextField) {
      activePlanSortDirection = activePlanSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      activePlanSortField = nextField;
      activePlanSortDirection = 'desc';
    }
    renderTable();
    return;
  }
  const selectAllButton = event.target.closest('[data-select-all]');
  if (!selectAllButton) return;
  if (selectedPlanIds.size === planRows.length) {
    selectedPlanIds.clear();
  } else {
    planRows.forEach((row) => selectedPlanIds.add(row.id));
  }
  renderTable();
});

tableHead.addEventListener('mouseover', (event) => {
  const help = event.target.closest('.plan-column-help');
  if (help) showPlanFieldTooltip(help);
});

tableHead.addEventListener('mouseout', (event) => {
  const help = event.target.closest('.plan-column-help');
  if (help && !help.contains(event.relatedTarget)) hidePlanFieldTooltip();
});

tableHead.addEventListener('focusin', (event) => {
  const help = event.target.closest('.plan-column-help');
  if (help) showPlanFieldTooltip(help);
});

tableHead.addEventListener('focusout', (event) => {
  if (event.target.closest('.plan-column-help')) hidePlanFieldTooltip();
});

window.addEventListener('scroll', hidePlanFieldTooltip, true);

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
const stageChartToolbar = document.querySelector('#stage-chart-toolbar');
const stageChartLegend = document.querySelector('#stage-chart-legend');
const stageTrendChart = document.querySelector('#stage-trend-chart');
const stageTrendFallback = document.querySelector('#stage-trend-fallback');
const stageChartCard = document.querySelector('.stage-chart-card');
const stageChartTooltip = document.querySelector('#stage-chart-tooltip');
const stageDetailTableBody = document.querySelector('#stage-detail-table-body');
const stageDetailTableHead = document.querySelector('#stage-detail-table-head');
const stageDetailTitle = document.querySelector('#stage-detail-title');
const stageDetailDownload = document.querySelector('#stage-detail-download');
const stageDetailColumnToggle = document.querySelector('#stage-detail-column-toggle');
const stageDetailColumnSettingsPanel = document.querySelector('#stage-detail-column-settings-panel');
const stageDetailSettingsList = document.querySelector('#stage-detail-settings-list');
const stageDetailColumnSearch = document.querySelector('#stage-detail-column-search');
const stageDetailSelectedList = document.querySelector('#stage-detail-selected-list');
const stageDetailSelectedCount = document.querySelector('#stage-detail-selected-count');
const stageDetailResetColumns = document.querySelector('#stage-detail-reset-columns');
const stageDetailClearColumns = document.querySelector('#stage-detail-clear-columns');
const stageDetailColumnCancel = document.querySelector('#stage-detail-column-cancel');
const stageDetailColumnConfirm = document.querySelector('#stage-detail-column-confirm');
const stageDetailRefresh = document.querySelector('#stage-detail-refresh');
const stageDetailFeedback = document.querySelector('#stage-detail-feedback');
const effectDetailTableHead = document.querySelector('#effect-detail-table-head');
const effectDetailTableBody = document.querySelector('#effect-detail-table-body');
const effectDatePickerElements = document.querySelectorAll('[data-effect-date-picker]');
const effectDatePickerStates = new Map();
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
  'spend', 'orderAmount', 'dealOrders', 'roi', 'actualEntries', 'clickUsers'
]);
let stageDateStart = '2026-07-13';
let stageDateEnd = '2026-07-17';
let draftStageDateStart = stageDateStart;
let draftStageDateEnd = stageDateEnd;
let stageTimeMode = 'day';
const stageDetailSortState = {
  day: { key: 'date', direction: 'asc' },
  hour: { key: 'date', direction: 'asc' }
};

const stageMetricDefinitions = {
  spend: { label: '周期内消耗金额', color: '#1769ff', format: 'money' },
  stageGmv: { label: '阶段GMV', color: '#ff9f43', format: 'money' },
  exposure: { label: '曝光数', color: '#7b61ff', format: 'integer' },
  views: { label: '观看数', color: '#18a0a8', format: 'integer' },
  actualEntries: { label: '总进入人数', color: '#ff7a45', format: 'integer' },
  clickUsers: { label: '商品点击人数', color: '#e455c4', format: 'integer' },
  clicks: { label: '商品点击次数', color: '#9a60d1', format: 'integer' },
  comments: { label: '评论次数', color: '#7bc043', format: 'integer' },
  clickCost: { label: '商品点击成本', color: '#00a870', format: 'money' },
  orders: { label: '下单订单数', color: '#f5a623', format: 'integer' },
  dealOrders: { label: '总成交订单数', color: '#e55353', format: 'integer' },
  orderAmount: { label: '总成交金额', color: '#e95065', format: 'money' },
  roi: { label: '总成交ROI', color: '#4f6bdc', format: 'decimal' }
};

const stageDetailFieldDefinitions = {
  periodSpend: { label: '周期内消耗金额', format: 'money' },
  totalDealAmount: { label: '总成交金额', format: 'money' },
  totalDealRoi: { label: '总成交ROI', format: 'decimal' },
  totalDealOrders: { label: '总成交订单数', format: 'integer' },
  totalEntries: { label: '总进入人数', format: 'integer' },
  totalExposure: { label: '总曝光人数', format: 'integer' },
  liveExposure: { label: '直播间曝光人数', format: 'integer' },
  clickCost: { label: '点击成本', format: 'money' },
  liveViewTimes: { label: '进入直播间观看人次', format: 'integer' },
  entryRate: { label: '进入率', format: 'percent' },
  productClicks: { label: '商品点击次数', format: 'integer' },
  productClickUsers: { label: '商品点击人数', format: 'integer' },
  productClickRate: { label: '商品点击率', format: 'percent' },
  clickDealRate: { label: '点击成交率', format: 'percent' },
  liveOrderRoi: { label: '当场下单 ROI', format: 'decimal' },
  liveOrders: { label: '当场下单订单数', format: 'integer' },
  totalLikes: { label: '总点赞数', format: 'integer' },
  totalComments: { label: '总评论数', format: 'integer' },
  totalFollowers: { label: '总新增关注数', format: 'integer' }
};
const defaultStageDetailFieldOrder = Object.keys(stageDetailFieldDefinitions);
const stageDetailColumnStorageKey = 'long-term-stage-detail-columns-v1';

function loadStageDetailFieldOrder() {
  try {
    const savedFields = JSON.parse(localStorage.getItem(stageDetailColumnStorageKey));
    if (!Array.isArray(savedFields)) return [...defaultStageDetailFieldOrder];
    return savedFields.filter((field) => stageDetailFieldDefinitions[field]);
  } catch (error) {
    return [...defaultStageDetailFieldOrder];
  }
}

let stageDetailFieldOrder = loadStageDetailFieldOrder();
let draftStageDetailFieldOrder = [...stageDetailFieldOrder];

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

function getStagePresetRange(rangeKey) {
  const today = '2026-07-17';
  const ranges = {
    today: [today, today],
    yesterday: [shiftStageDate(today, -1), shiftStageDate(today, -1)],
    last7: [shiftStageDate(today, -6), today],
    last30: [shiftStageDate(today, -29), today],
    thisMonth: [`${today.slice(0, 7)}-01`, today],
    last7WithoutToday: [shiftStageDate(today, -7), shiftStageDate(today, -1)],
    last30WithoutToday: [shiftStageDate(today, -30), shiftStageDate(today, -1)]
  };
  return ranges[rangeKey];
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
    const exceedsMaximum = !draftStageDateEnd && Math.abs(parseStageDate(dateText) - parseStageDate(draftStageDateStart)) / 86400000 > 29;
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

function getEffectDatePanelMarkup() {
  return `
    <aside class="stage-date-shortcuts">
      <button type="button" data-effect-range="today">今天</button>
      <button type="button" data-effect-range="yesterday">昨天</button>
      <button type="button" data-effect-range="last7">近7天</button>
      <button type="button" data-effect-range="last30">近30天</button>
      <button type="button" data-effect-range="thisMonth">本月</button>
      <button type="button" data-effect-range="last7WithoutToday">近7天-不含今</button>
      <button type="button" data-effect-range="last30WithoutToday">近30天-不含今</button>
    </aside>
    <div class="stage-calendar-main">
      <div class="stage-calendar-head"><button type="button" aria-label="上一月">«　‹</button><strong>2026-07</strong><strong>2026-08</strong><button type="button" aria-label="下一月">›　»</button></div>
      <div class="stage-calendar-months">
        <div class="stage-calendar-month"><div class="stage-calendar-week"><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span><span>日</span></div><div class="stage-calendar-days" data-effect-calendar-july></div></div>
        <div class="stage-calendar-month"><div class="stage-calendar-week"><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span><span>日</span></div><div class="stage-calendar-days" data-effect-calendar-august></div></div>
      </div>
      <div class="stage-calendar-footer">
        <span>▣　<b data-effect-calendar-start>2026-07-13</b></span><span class="is-disabled">◷　00:00:00</span>
        <span>▣　<b data-effect-calendar-end>2026-07-17</b></span><span class="is-disabled">◷　23:59:59</span>
        <button type="button" data-effect-date-confirm>确定</button>
      </div>
    </div>
  `;
}

function renderEffectCalendarMonth(container, year, month, state) {
  const firstDay = new Date(year, month, 1);
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  const firstCell = new Date(year, month, 1 - mondayOffset);
  container.innerHTML = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(firstCell);
    date.setDate(firstCell.getDate() + index);
    const dateText = formatStageDate(date);
    const classes = [];
    const exceedsMaximum = !state.draftEnd && Math.abs(parseStageDate(dateText) - parseStageDate(state.draftStart)) / 86400000 > 29;
    if (date.getMonth() !== month) classes.push('is-muted');
    if (exceedsMaximum) classes.push('is-disabled-range');
    if (state.draftEnd && dateText > state.draftStart && dateText < state.draftEnd) classes.push('is-in-range');
    if (dateText === state.draftStart || dateText === state.draftEnd) classes.push('is-selected');
    return `<button class="${classes.join(' ')}" type="button" data-effect-date="${dateText}" ${exceedsMaximum ? 'disabled' : ''}>${date.getDate()}</button>`;
  }).join('');
}

function renderEffectDateCalendars(picker, state) {
  renderEffectCalendarMonth(picker.querySelector('[data-effect-calendar-july]'), 2026, 6, state);
  renderEffectCalendarMonth(picker.querySelector('[data-effect-calendar-august]'), 2026, 7, state);
  picker.querySelector('[data-effect-calendar-start]').textContent = state.draftStart;
  picker.querySelector('[data-effect-calendar-end]').textContent = state.draftEnd || state.draftStart;
}

function syncEffectDateTrigger(picker, state) {
  picker.querySelector('[data-effect-date-start]').textContent = state.start;
  picker.querySelector('[data-effect-date-end]').textContent = state.end;
}

function closeEffectDatePickers(exceptPicker = null) {
  effectDatePickerElements.forEach((picker) => {
    if (picker === exceptPicker) return;
    picker.querySelector('.effect-date-panel').hidden = true;
    picker.querySelector('.effect-date-trigger').setAttribute('aria-expanded', 'false');
  });
}

effectDatePickerElements.forEach((picker) => {
  const trigger = picker.querySelector('.effect-date-trigger');
  const panel = picker.querySelector('.effect-date-panel');
  const state = {
    start: picker.querySelector('[data-effect-date-start]').textContent.trim(),
    end: picker.querySelector('[data-effect-date-end]').textContent.trim()
  };
  state.draftStart = state.start;
  state.draftEnd = state.end;
  effectDatePickerStates.set(picker, state);
  panel.innerHTML = getEffectDatePanelMarkup();
  renderEffectDateCalendars(picker, state);

  trigger.addEventListener('click', () => {
    const willOpen = panel.hidden;
    closeEffectDatePickers(picker);
    if (willOpen) {
      state.draftStart = state.start;
      state.draftEnd = state.end;
      renderEffectDateCalendars(picker, state);
    }
    panel.hidden = !willOpen;
    trigger.setAttribute('aria-expanded', String(willOpen));
  });

  panel.addEventListener('click', (event) => {
    const dateButton = event.target.closest('[data-effect-date]');
    if (dateButton) {
      const selectedDate = dateButton.dataset.effectDate;
      if (state.draftEnd) {
        state.draftStart = selectedDate;
        state.draftEnd = '';
      } else if (selectedDate < state.draftStart) {
        state.draftEnd = state.draftStart;
        state.draftStart = selectedDate;
      } else {
        state.draftEnd = selectedDate;
      }
      renderEffectDateCalendars(picker, state);
      return;
    }

    const rangeButton = event.target.closest('[data-effect-range]');
    if (rangeButton) {
      const range = getStagePresetRange(rangeButton.dataset.effectRange);
      if (!range) return;
      [state.draftStart, state.draftEnd] = range;
      renderEffectDateCalendars(picker, state);
      return;
    }

    if (!event.target.closest('[data-effect-date-confirm]')) return;
    state.start = state.draftStart;
    state.end = state.draftEnd || state.draftStart;
    if (getStageDateRangeDays(state.start, state.end) > 30) state.end = shiftStageDate(state.start, 29);
    state.draftEnd = state.end;
    syncEffectDateTrigger(picker, state);
    panel.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
  });
});

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

function getStageDetailValue(row, fieldKey) {
  const values = {
    periodSpend: row.spend,
    totalDealAmount: row.orderAmount,
    totalDealRoi: row.roi,
    totalDealOrders: row.dealOrders,
    totalEntries: row.actualEntries,
    totalExposure: row.exposure,
    liveExposure: Math.round(row.exposure * 0.82),
    clickCost: row.clickCost,
    liveViewTimes: row.views,
    entryRate: row.exposure ? (row.actualEntries / row.exposure) * 100 : 0,
    productClicks: row.clicks,
    productClickUsers: row.clickUsers,
    productClickRate: row.actualEntries ? (row.clickUsers / row.actualEntries) * 100 : 0,
    clickDealRate: row.clickUsers ? (row.dealOrders / row.clickUsers) * 100 : 0,
    liveOrderRoi: row.spend ? row.stageGmv / row.spend : 0,
    liveOrders: row.orders,
    totalLikes: Math.round(row.comments * 3.6),
    totalComments: row.comments,
    totalFollowers: Math.round(row.actualEntries * 0.035)
  };
  return Number(values[fieldKey] || 0);
}

function formatStageDetailValue(fieldKey, value) {
  const format = stageDetailFieldDefinitions[fieldKey].format;
  if (format === 'money') return `￥${Number(value).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (format === 'percent') return `${Number(value).toFixed(2)}%`;
  if (format === 'decimal') return Number(value).toFixed(2);
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
  const rangeDays = getStageDateRangeDays(stageDateStart, stageDateEnd);
  const maximumTrendDays = stageTimeMode === 'hour' ? 7 : 30;
  const isTrendSupported = rangeDays <= maximumTrendDays;
  stageChartTooltip.hidden = true;
  stageChartToolbar.hidden = !isTrendSupported;
  stageChartLegend.hidden = !isTrendSupported;
  stageTrendChart.classList.toggle('is-hidden', !isTrendSupported);
  stageTrendFallback.hidden = isTrendSupported;
  if (!isTrendSupported) {
    stageTrendFallback.textContent = stageTimeMode === 'hour'
      ? '趋势图仅支持7天内数据，请缩短筛选范围'
      : '趋势图仅支持30天内数据，请缩短筛选范围';
    return;
  }
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
  const sortState = stageDetailSortState[stageTimeMode];
  const visibleRows = [...getVisibleStageData()];
  visibleRows.sort((firstRow, secondRow) => {
    let firstValue;
    let secondValue;
    if (sortState.key === 'date') {
      firstValue = firstRow.date;
      secondValue = secondRow.date;
    } else if (sortState.key === 'period') {
      firstValue = firstRow.hour;
      secondValue = secondRow.hour;
    } else {
      firstValue = getStageDetailValue(firstRow, sortState.key);
      secondValue = getStageDetailValue(secondRow, sortState.key);
    }
    const result = typeof firstValue === 'string'
      ? firstValue.localeCompare(secondValue)
      : Number(firstValue) - Number(secondValue);
    if (result !== 0) return sortState.direction === 'asc' ? result : -result;
    if (stageTimeMode === 'hour') return firstRow.date.localeCompare(secondRow.date) || firstRow.hour - secondRow.hour;
    return firstRow.date.localeCompare(secondRow.date);
  });
  const renderSortableHeader = (label, key) => {
    const isActive = sortState.key === key;
    const ariaSort = isActive ? (sortState.direction === 'asc' ? 'ascending' : 'descending') : 'none';
    const stateClass = isActive ? ` is-active is-${sortState.direction}` : '';
    return `<th aria-sort="${ariaSort}"><button class="stage-sort-button${stateClass}" type="button" data-stage-sort="${key}">${label}<span aria-hidden="true"></span></button></th>`;
  };
  const metricHeaders = stageDetailFieldOrder.map((fieldKey) => renderSortableHeader(stageDetailFieldDefinitions[fieldKey].label, fieldKey)).join('');
  stageDetailTitle.textContent = stageTimeMode === 'hour' ? '分时数据明细' : '每日数据明细';
  stageDetailTableHead.innerHTML = `${renderSortableHeader('统计日期', 'date')}${stageTimeMode === 'hour' ? renderSortableHeader('时段', 'period') : ''}${metricHeaders}`;
  stageDetailTableBody.innerHTML = visibleRows.length ? visibleRows.map((row) => `
    <tr><td>${row.date}</td>${stageTimeMode === 'hour' ? `<td>${row.period}</td>` : ''}${stageDetailFieldOrder.map((fieldKey) => `<td>${formatStageDetailValue(fieldKey, getStageDetailValue(row, fieldKey))}</td>`).join('')}</tr>
  `).join('') : `<tr><td colspan="${stageDetailFieldOrder.length + (stageTimeMode === 'hour' ? 2 : 1)}" style="text-align:center;color:#a2abb8">暂无数据</td></tr>`;
}

function renderStageDetailSettingsList(query = '') {
  const normalizedQuery = query.trim().toLowerCase();
  const visibleFields = defaultStageDetailFieldOrder.filter((fieldKey) =>
    stageDetailFieldDefinitions[fieldKey].label.toLowerCase().includes(normalizedQuery)
  );
  const isAllSelected = defaultStageDetailFieldOrder.every((fieldKey) => draftStageDetailFieldOrder.includes(fieldKey));
  const selectedCount = defaultStageDetailFieldOrder.filter((fieldKey) => draftStageDetailFieldOrder.includes(fieldKey)).length;
  stageDetailSettingsList.innerHTML = visibleFields.length ? `
    <section class="column-settings-section" data-column-section="投放数据">
      ${normalizedQuery ? '<div class="picker-section-title"><span>投放数据</span></div>' : `
        <label class="picker-section-title">
          <input type="checkbox" data-stage-detail-select-all ${isAllSelected ? 'checked' : ''} aria-label="全选投放数据指标">
          <span>投放数据</span>
        </label>
      `}
      <div class="column-settings-grid">
        ${visibleFields.map((fieldKey) => `
          <label class="column-setting-item">
            <input type="checkbox" value="${fieldKey}" ${draftStageDetailFieldOrder.includes(fieldKey) ? 'checked' : ''}>
            <span>${stageDetailFieldDefinitions[fieldKey].label}</span>
          </label>
        `).join('')}
      </div>
    </section>
  ` : '<div class="column-settings-empty">暂无匹配字段</div>';
  const selectAll = stageDetailSettingsList.querySelector('[data-stage-detail-select-all]');
  if (selectAll) selectAll.indeterminate = selectedCount > 0 && selectedCount < defaultStageDetailFieldOrder.length;
}

function renderStageDetailSelectedColumns() {
  stageDetailSelectedList.innerHTML = draftStageDetailFieldOrder.length ? draftStageDetailFieldOrder.map((fieldKey) => `
    <div class="selected-column-item" draggable="true" data-field="${fieldKey}">
      <span class="drag-handle">≡</span>
      <span class="selected-column-name">${stageDetailFieldDefinitions[fieldKey].label}</span>
      <button class="remove-column-button" type="button" data-remove-stage-detail-field="${fieldKey}" aria-label="移除${stageDetailFieldDefinitions[fieldKey].label}">×</button>
    </div>
  `).join('') : `
    <div class="selected-column-empty">
      <span>暂无已选指标</span>
      <p>请从左侧勾选需要展示的指标</p>
    </div>
  `;
  stageDetailSelectedCount.textContent = String(draftStageDetailFieldOrder.length);
  stageDetailResetColumns.disabled = draftStageDetailFieldOrder.length === defaultStageDetailFieldOrder.length
    && draftStageDetailFieldOrder.every((fieldKey, index) => fieldKey === defaultStageDetailFieldOrder[index]);
  stageDetailClearColumns.disabled = draftStageDetailFieldOrder.length === 0;
}

function refreshStageDetailColumnSettings() {
  renderStageDetailSettingsList(stageDetailColumnSearch.value);
  renderStageDetailSelectedColumns();
}

function closeStageDetailColumnSettings() {
  stageDetailColumnSettingsPanel.hidden = true;
  stageDetailColumnToggle.setAttribute('aria-expanded', 'false');
}

function showStageDetailFeedback(message) {
  stageDetailFeedback.textContent = message;
  clearTimeout(showStageDetailFeedback.timer);
  showStageDetailFeedback.timer = setTimeout(() => { stageDetailFeedback.textContent = ''; }, 2600);
}

function renderStageSummary() {
  const visibleRows = getVisibleStageDailyData();
  const total = (field) => visibleRows.reduce((sum, row) => sum + row[field], 0);
  const spend = total('spend');
  const orderAmount = total('orderAmount');
  stageTotalSpend.textContent = formatStageMetric('spend', spend);
  stageTotalOrderAmount.textContent = formatStageMetric('orderAmount', orderAmount);
  stageTotalOrders.textContent = total('dealOrders').toLocaleString('zh-CN');
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
  const range = getStagePresetRange(rangeButton.dataset.stageRange);
  if (range) setDraftStageRange(...range);
});

stageDateConfirm.addEventListener('click', () => {
  stageDateStart = draftStageDateStart;
  stageDateEnd = draftStageDateEnd || draftStageDateStart;
  if (getStageDateRangeDays(stageDateStart, stageDateEnd) > 30) stageDateEnd = shiftStageDate(stageDateStart, 29);
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

stageDetailDownload.addEventListener('click', () => {
  const safePlanName = drawerPlanName.textContent.trim().replace(/[\\/:*?"<>|]/g, '') || '长期计划';
  const fileName = `${safePlanName}【投放数据】${stageDateStart}至${stageDateEnd}.xlsx`;
  showStageDetailFeedback(`将下载：${fileName}`);
});

stageDetailColumnToggle.addEventListener('click', () => {
  draftStageDetailFieldOrder = [...stageDetailFieldOrder];
  stageDetailColumnSearch.value = '';
  refreshStageDetailColumnSettings();
  stageDetailColumnSettingsPanel.hidden = false;
  stageDetailColumnToggle.setAttribute('aria-expanded', 'true');
});

stageDetailSettingsList.addEventListener('change', (event) => {
  const checkbox = event.target;
  if (!(checkbox instanceof HTMLInputElement)) return;
  if (checkbox.matches('[data-stage-detail-select-all]')) {
    if (checkbox.checked) {
      defaultStageDetailFieldOrder.forEach((fieldKey) => {
        if (!draftStageDetailFieldOrder.includes(fieldKey)) draftStageDetailFieldOrder.push(fieldKey);
      });
    } else {
      draftStageDetailFieldOrder = [];
    }
  } else if (checkbox.checked && !draftStageDetailFieldOrder.includes(checkbox.value)) {
    draftStageDetailFieldOrder.push(checkbox.value);
  } else if (!checkbox.checked) {
    draftStageDetailFieldOrder = draftStageDetailFieldOrder.filter((fieldKey) => fieldKey !== checkbox.value);
  }
  refreshStageDetailColumnSettings();
});

stageDetailColumnSearch.addEventListener('input', () => renderStageDetailSettingsList(stageDetailColumnSearch.value));

stageDetailSelectedList.addEventListener('click', (event) => {
  const removeButton = event.target.closest('[data-remove-stage-detail-field]');
  if (!removeButton) return;
  draftStageDetailFieldOrder = draftStageDetailFieldOrder.filter((fieldKey) => fieldKey !== removeButton.dataset.removeStageDetailField);
  refreshStageDetailColumnSettings();
});

stageDetailResetColumns.addEventListener('click', () => {
  draftStageDetailFieldOrder = [...defaultStageDetailFieldOrder];
  refreshStageDetailColumnSettings();
});

stageDetailClearColumns.addEventListener('click', () => {
  draftStageDetailFieldOrder = [];
  refreshStageDetailColumnSettings();
});

stageDetailSelectedList.addEventListener('dragstart', (event) => {
  const item = event.target.closest('.selected-column-item');
  if (!item) return;
  item.classList.add('dragging');
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', item.dataset.field);
});

stageDetailSelectedList.addEventListener('dragend', (event) => {
  const item = event.target.closest('.selected-column-item');
  if (item) item.classList.remove('dragging');
});

stageDetailSelectedList.addEventListener('dragover', (event) => event.preventDefault());

stageDetailSelectedList.addEventListener('drop', (event) => {
  event.preventDefault();
  const targetItem = event.target.closest('.selected-column-item');
  const draggedField = event.dataTransfer.getData('text/plain');
  if (!targetItem || !draggedField || targetItem.dataset.field === draggedField) return;
  const reorderedFields = draftStageDetailFieldOrder.filter((fieldKey) => fieldKey !== draggedField);
  const targetIndex = reorderedFields.indexOf(targetItem.dataset.field);
  reorderedFields.splice(targetIndex, 0, draggedField);
  draftStageDetailFieldOrder = reorderedFields;
  renderStageDetailSelectedColumns();
});

stageDetailColumnCancel.addEventListener('click', closeStageDetailColumnSettings);

stageDetailColumnConfirm.addEventListener('click', () => {
  stageDetailFieldOrder = [...draftStageDetailFieldOrder];
  try {
    localStorage.setItem(stageDetailColumnStorageKey, JSON.stringify(stageDetailFieldOrder));
  } catch (error) {
    // 本地缓存不可用时仍保留本次页面设置。
  }
  const sortState = stageDetailSortState[stageTimeMode];
  if (!['date', 'period', ...stageDetailFieldOrder].includes(sortState.key)) {
    sortState.key = 'date';
    sortState.direction = 'asc';
  }
  closeStageDetailColumnSettings();
  renderStageDetailTable();
  showStageDetailFeedback('列设置已保存');
});

stageDetailRefresh.addEventListener('click', () => {
  stageDetailRefresh.classList.add('is-refreshing');
  renderStageData();
  showStageDetailFeedback('数据已刷新');
  setTimeout(() => stageDetailRefresh.classList.remove('is-refreshing'), 450);
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

document.addEventListener('click', (event) => {
  if (event.target.closest('[data-effect-date-picker]')) return;
  closeEffectDatePickers();
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

  const adjustButton = event.target.closest('[data-adjust-plan]');
  if (adjustButton) {
    const row = planRows[Number(adjustButton.dataset.adjustPlan)];
    const params = new URLSearchParams({ mode: 'edit', planId: row.id, state: row.deliveryState });
    window.location.href = `新建长期计划.html?${params.toString()}`;
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
  const drawerAmount = row.amount ?? row.dailyBudget ?? 2000;
  drawerPlanAmount.textContent = `￥${String(drawerAmount).replace(/^￥/, '')}`;
  showDrawerPanel('stage-data');
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
const financePlanTypeTrigger = document.querySelector('#finance-plan-type-trigger');
const financePlanTypeLabel = document.querySelector('#finance-plan-type-label');
const financePlanTypePanel = document.querySelector('#finance-plan-type-panel');
const financePlanTypeOptions = financePlanTypePanel.querySelectorAll('[data-finance-plan-type]');
const financeAccountFilter = document.querySelector('#finance-account-filter');
const financeTargetFilter = document.querySelector('#finance-target-filter');
const financeResetButton = document.querySelector('#finance-reset');
const financeRefreshButton = document.querySelector('#finance-refresh');
const financeTotal = document.querySelector('#finance-total');
const financeModeButtons = document.querySelectorAll('[data-finance-mode]');
let financeMode = 'day';
let selectedFinancePlanType = '';

function renderFinanceTable() {
  const sourceRows = financeMode === 'day' ? dailyFinanceRows : monthlyFinanceRows;
  const visibleRows = sourceRows.filter((row) => !selectedFinancePlanType || row.type === selectedFinancePlanType);
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
  financeTotal.textContent = selectedFinancePlanType ? `共 ${visibleRows.length} 条` : (financeMode === 'day' ? '共 31 条' : '共 12 条');
}

function updateFinancePlanTypeLabel() {
  financePlanTypeLabel.textContent = selectedFinancePlanType || '选择计划类型';
  financePlanTypeTrigger.classList.toggle('has-value', Boolean(selectedFinancePlanType));
}

function closeFinancePlanTypeFilter() {
  financePlanTypePanel.hidden = true;
  financePlanTypeTrigger.setAttribute('aria-expanded', 'false');
}

financePlanTypeTrigger.addEventListener('click', () => {
  const nextOpen = financePlanTypePanel.hidden;
  financePlanTypePanel.hidden = !nextOpen;
  financePlanTypeTrigger.setAttribute('aria-expanded', String(nextOpen));
});

financePlanTypePanel.addEventListener('click', (event) => {
  const option = event.target.closest('[data-finance-plan-type]');
  if (!option) return;
  const planType = option.dataset.financePlanType;
  selectedFinancePlanType = selectedFinancePlanType === planType ? '' : planType;
  financePlanTypeOptions.forEach((candidate) => {
    const isSelected = candidate.dataset.financePlanType === selectedFinancePlanType;
    candidate.classList.toggle('is-selected', isSelected);
    candidate.setAttribute('aria-pressed', String(isSelected));
  });
  updateFinancePlanTypeLabel();
  closeFinancePlanTypeFilter();
  renderFinanceTable();
});

document.addEventListener('click', (event) => {
  if (!financePlanTypeFilter.contains(event.target)) closeFinancePlanTypeFilter();
});

financeResetButton.addEventListener('click', () => {
  financeAccountFilter.value = '';
  financeTargetFilter.value = '';
  selectedFinancePlanType = '';
  financePlanTypeOptions.forEach((option) => {
    option.classList.remove('is-selected');
    option.setAttribute('aria-pressed', 'false');
  });
  updateFinancePlanTypeLabel();
  closeFinancePlanTypeFilter();
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
const shortVideoPlanTypeTrigger = document.querySelector('#short-video-plan-type-trigger');
const shortVideoPlanTypeLabel = document.querySelector('#short-video-plan-type-label');
const shortVideoPlanTypePanel = document.querySelector('#short-video-plan-type-panel');
const shortVideoPlanTypeOptions = shortVideoPlanTypePanel.querySelectorAll('[data-short-video-plan-type]');
const shortVideoResetButton = document.querySelector('#short-video-reset');
const shortVideoRefreshButton = document.querySelector('#short-video-refresh');
const shortVideoTotal = document.querySelector('#short-video-total');
const shortVideoDetailLayer = document.querySelector('#short-video-detail-layer');
const shortVideoDetailBody = document.querySelector('#short-video-detail-body');
let selectedShortVideoPlanType = '';

function getFilteredShortVideoRows() {
  const note = shortVideoNoteFilter.value.trim().toLowerCase();
  const description = shortVideoDescriptionFilter.value.trim().toLowerCase();
  const target = shortVideoTargetFilter.value;
  return shortVideoRows.map((row, index) => ({ row, index })).filter(({ row }) =>
    (!note || row.note.toLowerCase().includes(note)) &&
    (!description || row.description.toLowerCase().includes(description)) &&
    (!target || row.account === target) &&
    (!selectedShortVideoPlanType || row.type === selectedShortVideoPlanType)
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
  const filtering = shortVideoNoteFilter.value || shortVideoDescriptionFilter.value || shortVideoTargetFilter.value || selectedShortVideoPlanType;
  shortVideoTotal.textContent = filtering ? `共 ${visibleRows.length} 条` : '共 22 条';
}

[shortVideoNoteFilter, shortVideoDescriptionFilter].forEach((input) => input.addEventListener('input', renderShortVideoTable));
shortVideoTargetFilter.addEventListener('change', renderShortVideoTable);

function updateShortVideoPlanTypeLabel() {
  shortVideoPlanTypeLabel.textContent = selectedShortVideoPlanType || '选择计划类型';
  shortVideoPlanTypeTrigger.classList.toggle('has-value', Boolean(selectedShortVideoPlanType));
}

function closeShortVideoPlanTypeFilter() {
  shortVideoPlanTypePanel.hidden = true;
  shortVideoPlanTypeTrigger.setAttribute('aria-expanded', 'false');
}

shortVideoPlanTypeTrigger.addEventListener('click', () => {
  const nextOpen = shortVideoPlanTypePanel.hidden;
  shortVideoPlanTypePanel.hidden = !nextOpen;
  shortVideoPlanTypeTrigger.setAttribute('aria-expanded', String(nextOpen));
});

shortVideoPlanTypePanel.addEventListener('click', (event) => {
  const option = event.target.closest('[data-short-video-plan-type]');
  if (!option) return;
  const planType = option.dataset.shortVideoPlanType;
  selectedShortVideoPlanType = selectedShortVideoPlanType === planType ? '' : planType;
  shortVideoPlanTypeOptions.forEach((candidate) => {
    const isSelected = candidate.dataset.shortVideoPlanType === selectedShortVideoPlanType;
    candidate.classList.toggle('is-selected', isSelected);
    candidate.setAttribute('aria-pressed', String(isSelected));
  });
  updateShortVideoPlanTypeLabel();
  closeShortVideoPlanTypeFilter();
  renderShortVideoTable();
});

document.addEventListener('click', (event) => {
  if (!shortVideoPlanTypeFilter.contains(event.target)) closeShortVideoPlanTypeFilter();
});

shortVideoResetButton.addEventListener('click', () => {
  shortVideoNoteFilter.value = '';
  shortVideoDescriptionFilter.value = '';
  shortVideoTargetFilter.value = '';
  selectedShortVideoPlanType = '';
  shortVideoPlanTypeOptions.forEach((option) => {
    option.classList.remove('is-selected');
    option.setAttribute('aria-pressed', 'false');
  });
  updateShortVideoPlanTypeLabel();
  closeShortVideoPlanTypeFilter();
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
  { strategyType: '亏损监控', name: '或者', planType: '标准计划', rule: '消耗金额>3元（近1天）或无阶段商品点击时长>=32分钟', dimension: '指定订单', method: '自动关停', period: '全天', creator: '杨乔测试', createdAt: '2026-06-10 14:39:36', enabled: true },
  { strategyType: '自定义', name: '44', planType: '长期计划', rule: '周期内消耗金额>2000元（近7天）且成交ROI<2（近7天）', dimension: '指定订单', method: '自动暂停', period: '全天', creator: '高良测试', createdAt: '2026-06-09 17:22:21', enabled: true },
  { strategyType: '自定义', name: '2.8关停回归', planType: '标准计划', rule: '无阶段商品点击时长>=14分钟或消耗金额>0.1元（近1天）', dimension: '指定订单', method: '自动关停', period: '全天', creator: '高良测试', createdAt: '2026-03-30 17:32:32', enabled: true },
  { strategyType: '自定义', name: '（勿关）测试账号关停兜底策略', planType: '长期计划', rule: '总消耗金额>2000元且成交ROI<2（近7天）', dimension: '投放号', method: '自动暂停', period: '全天', creator: '师文科', createdAt: '2026-03-27 15:53:35', enabled: false },
  { strategyType: '自定义', name: '关停逻辑回归', planType: '标准计划', rule: 'ROI<0.5（近1天）', dimension: '指定订单', method: '自动关停', period: '全天', creator: '高良测试', createdAt: '2026-03-12 15:48:48', enabled: true },
  { strategyType: '低消监控', name: '核心隐藏2', planType: '长期计划', rule: '总消耗金额≤2元且实际加热时长>3天', dimension: '指定订单', method: '自动暂停', period: '全天', creator: '高良测试', createdAt: '2026-03-10 11:01:20', enabled: false },
  { strategyType: '自定义', name: '核心功能隐藏', planType: '标准计划', rule: '无阶段商品点击时长>2分钟且存在阶段消耗>1元', dimension: '指定订单', method: '自动关停', period: '全天', creator: '高良测试', createdAt: '2026-03-09 14:22:58', enabled: false }
];

const shutdownTableBody = document.querySelector('#shutdown-table-body');
const shutdownRuleTooltip = document.querySelector('#shutdown-rule-tooltip');
const shutdownNameFilter = document.querySelector('#shutdown-name-filter');
const shutdownPlanTypeFilter = document.querySelector('#shutdown-plan-type-filter');
const shutdownPlanTypeTrigger = document.querySelector('#shutdown-plan-type-trigger');
const shutdownPlanTypeLabel = document.querySelector('#shutdown-plan-type-label');
const shutdownPlanTypePanel = document.querySelector('#shutdown-plan-type-panel');
const shutdownPlanTypeOptions = shutdownPlanTypePanel.querySelectorAll('[data-shutdown-plan-type]');
const shutdownResetButton = document.querySelector('#shutdown-reset');
const shutdownTotal = document.querySelector('#shutdown-total');
const shutdownModal = document.querySelector('#shutdown-strategy-modal');
const shutdownDialogTitle = document.querySelector('#shutdown-dialog-title');
const shutdownNameInput = document.querySelector('#shutdown-strategy-name');
const shutdownStrategyPlanType = document.querySelector('#shutdown-strategy-plan-type');
const shutdownFormPlanTypeOptions = document.querySelectorAll('[name="shutdown-form-plan-type"]');
const shutdownStrategyType = document.querySelector('#shutdown-strategy-type');
const shutdownRulePanel = document.querySelector('#shutdown-rule-panel');
const shutdownRuleList = document.querySelector('#shutdown-rule-list');
const shutdownRuleActions = shutdownRulePanel.querySelector('.shutdown-rule-actions');
const shutdownAddRuleButton = shutdownRuleActions.querySelector('button');
const shutdownOfflineWarning = document.querySelector('#shutdown-offline-warning');
const shutdownRuleRelationAnd = document.querySelector('#shutdown-rule-relation-and');
const shutdownRuleRelationOr = document.querySelector('#shutdown-rule-relation-or');
const shutdownNameCount = document.querySelector('#shutdown-name-count');
const shutdownDimensionOptions = document.querySelectorAll('[data-shutdown-dimension]');
const shutdownAccountScope = document.querySelector('#shutdown-account-scope');
const shutdownTargetScopeOptions = document.querySelectorAll('[name="shutdown-target-scope"]');
const shutdownMaterialScopeOptions = document.querySelectorAll('[name="shutdown-material-scope"]');
const shutdownTargetSelect = document.querySelector('#shutdown-target-select');
const shutdownMaterialSelect = document.querySelector('#shutdown-material-select');
const shutdownStandardOnlySections = document.querySelectorAll('.shutdown-standard-only');
const shutdownLongTermOnlySections = document.querySelectorAll('.shutdown-longterm-only');
const shutdownMonitorMethod = document.querySelector('#shutdown-monitor-method');
const shutdownMonitorMethodError = document.querySelector('#shutdown-monitor-method-error');
const shutdownRestartToggle = document.querySelector('#shutdown-restart-toggle');
const shutdownRestartConfig = document.querySelector('#shutdown-restart-config');
const shutdownRestartHint = document.querySelector('#shutdown-restart-hint');
const shutdownRestartInterval = document.querySelector('#shutdown-restart-interval');
const shutdownRestartModeOptions = document.querySelectorAll('[name="shutdown-restart-mode"]');
const shutdownRestartCycleOption = document.querySelector('#shutdown-restart-cycle-option');
const shutdownRestartDescription = document.querySelector('#shutdown-restart-description');
const shutdownRestartError = document.querySelector('#shutdown-restart-error');
const shutdownStrategyKindOptions = document.querySelectorAll('[name="shutdown-strategy-kind"]');
let editingShutdownIndex = -1;
let selectedShutdownPlanType = '';

function getSelectedShutdownFormPlanType() {
  return [...shutdownFormPlanTypeOptions].find((option) => option.checked)?.value || '标准计划';
}

function renderShutdownTable() {
  const keyword = shutdownNameFilter.value.trim().toLowerCase();
  const rows = shutdownRows.map((row, index) => ({ row, index })).filter(({ row }) =>
    (!keyword || row.name.toLowerCase().includes(keyword)) &&
    (!selectedShutdownPlanType || row.planType.includes(selectedShutdownPlanType))
  );
  shutdownTableBody.innerHTML = rows.map(({ row, index }) => `
    <tr><td>${row.strategyType}</td><td>${escapeAudienceText(row.name)}</td><td>${renderPlanTypeTags(row.planType)}</td><td><span class="shutdown-rule-text" tabindex="0" aria-label="${escapeAudienceText(row.rule)}" data-tooltip="${escapeAudienceText(row.rule)}">${escapeAudienceText(row.rule)}</span></td><td>${row.dimension}</td><td>${row.method}</td><td>${row.period}</td><td>${row.creator}</td><td>${row.createdAt}</td><td><button class="shutdown-switch${row.enabled ? ' is-on' : ''}" type="button" data-shutdown-toggle="${index}"></button><div><button class="shutdown-action" type="button" data-shutdown-edit="${index}">修改</button><button class="shutdown-action is-delete" type="button" data-shutdown-delete="${index}">删除</button></div></td></tr>
  `).join('');
  shutdownTotal.textContent = keyword || selectedShutdownPlanType ? `共 ${rows.length} 条` : '共 65 条';
}

function showShutdownRuleTooltip(target) {
  shutdownRuleTooltip.textContent = target.dataset.tooltip;
  shutdownRuleTooltip.hidden = false;
  const targetRect = target.getBoundingClientRect();
  const tooltipRect = shutdownRuleTooltip.getBoundingClientRect();
  const preferredLeft = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
  const left = Math.min(window.innerWidth - tooltipRect.width - 12, Math.max(12, preferredLeft));
  const top = Math.max(12, targetRect.top - tooltipRect.height - 8);
  const arrowLeft = Math.min(tooltipRect.width - 12, Math.max(12, targetRect.left + targetRect.width / 2 - left));
  shutdownRuleTooltip.style.left = `${left}px`;
  shutdownRuleTooltip.style.top = `${top}px`;
  shutdownRuleTooltip.style.setProperty('--shutdown-tooltip-arrow-left', `${arrowLeft}px`);
}

function hideShutdownRuleTooltip() {
  shutdownRuleTooltip.hidden = true;
}

shutdownTableBody.addEventListener('mouseover', (event) => {
  const rule = event.target.closest('.shutdown-rule-text');
  if (rule) showShutdownRuleTooltip(rule);
});

shutdownTableBody.addEventListener('mouseout', (event) => {
  const rule = event.target.closest('.shutdown-rule-text');
  if (rule && !rule.contains(event.relatedTarget)) hideShutdownRuleTooltip();
});

shutdownTableBody.addEventListener('focusin', (event) => {
  const rule = event.target.closest('.shutdown-rule-text');
  if (rule) showShutdownRuleTooltip(rule);
});

shutdownTableBody.addEventListener('focusout', (event) => {
  if (event.target.closest('.shutdown-rule-text')) hideShutdownRuleTooltip();
});

window.addEventListener('scroll', hideShutdownRuleTooltip, true);

function updateShutdownPlanTypeLabel() {
  shutdownPlanTypeLabel.textContent = selectedShutdownPlanType || '选择计划类型';
  shutdownPlanTypeTrigger.classList.toggle('has-value', Boolean(selectedShutdownPlanType));
}

function closeShutdownPlanTypeFilter() {
  shutdownPlanTypePanel.hidden = true;
  shutdownPlanTypeTrigger.setAttribute('aria-expanded', 'false');
}

function getShutdownRuleUnit(condition, durationUnit = '天') {
  if (condition === '实际加热时长') return durationUnit;
  if (['周期内消耗金额', '总消耗金额', '消耗金额', '空耗值'].includes(condition)) return '元';
  return '';
}

function shutdownRuleNeedsPeriod(condition) {
  return ['周期内消耗金额', '消耗金额', '成交ROI'].includes(condition);
}

function getShutdownRuleConditions(row) {
  if (row?.dataset.conditionChoices) return row.dataset.conditionChoices.split('|');
  return getSelectedShutdownFormPlanType() === '长期计划'
    ? ['实际加热时长', '周期内消耗金额', '总消耗金额', '成交ROI']
    : ['消耗金额', '成交ROI', '空耗值'];
}

function applyShutdownRuleValueConstraints(row) {
  const condition = row.querySelector('.shutdown-rule-condition').value;
  const input = row.querySelector('.shutdown-rule-value');
  if (getSelectedShutdownFormPlanType() !== '长期计划') {
    input.type = 'text';
    input.removeAttribute('min');
    input.removeAttribute('max');
    input.removeAttribute('step');
    input.placeholder = '请输入';
    input.disabled = false;
    input.setCustomValidity('');
    return;
  }
  input.type = 'number';
  input.removeAttribute('max');
  input.min = condition === '实际加热时长' ? '1' : '0';
  input.max = condition === '实际加热时长' ? '99' : '';
  input.step = condition === '成交ROI' ? '0.01' : '1';
  input.placeholder = condition ? '请输入' : '请先选择条件';
  input.disabled = !condition;
  input.setCustomValidity('');
}

function refreshShutdownRuleConditionOptions() {
  const rows = [...shutdownRuleList.querySelectorAll('.shutdown-rule-row')];
  rows.forEach((row) => {
    const select = row.querySelector('.shutdown-rule-condition');
    if (select.disabled) return;
    const currentValue = select.value;
    const otherSelections = new Set(rows.filter((candidate) => candidate !== row).map((candidate) => candidate.querySelector('.shutdown-rule-condition').value).filter(Boolean));
    const availableConditions = getShutdownRuleConditions(row).filter((condition) => condition === currentValue || !otherSelections.has(condition));
    select.innerHTML = `<option value="">请选择条件</option>${availableConditions.map((condition) => `<option${condition === currentValue ? ' selected' : ''}>${condition}</option>`).join('')}`;
  });
}

function createShutdownRuleRow({ index, condition = '', operator = '', fixedCondition = false, fixedOperator = false, conditionChoices = null, durationUnit = '天', periodUnitSwitch = false }) {
  const isLongTermPlan = getSelectedShutdownFormPlanType() === '长期计划';
  const conditions = conditionChoices || (isLongTermPlan
    ? ['实际加热时长', '周期内消耗金额', '总消耗金额', '成交ROI']
    : ['消耗金额', '成交ROI', '空耗值']);
  const conditionOptions = fixedCondition
    ? `<option selected>${condition}</option>`
    : `<option value="">请选择条件</option>${conditions.map((item) => `<option${item === condition ? ' selected' : ''}>${item}</option>`).join('')}`;
  const operatorOptions = `<option value="">请选择</option><option value=">"${operator === '>' ? ' selected' : ''}>&gt;</option><option value="≤"${operator === '≤' ? ' selected' : ''}>≤</option>`;
  const unit = getShutdownRuleUnit(condition, durationUnit);
  const showPeriod = shutdownRuleNeedsPeriod(condition);
  const periodUnitControl = periodUnitSwitch
    ? '<select class="shutdown-query-period-unit" aria-label="查询数据周期单位"><option value="天" selected>天</option><option value="小时">小时</option></select>'
    : '<span class="shutdown-query-period-static-unit">天</span>';
  return `
    <div class="shutdown-rule-row" data-duration-unit="${durationUnit}" data-period-unit="天" data-condition-choices="${conditionChoices ? conditionChoices.join('|') : ''}">
      <span class="shutdown-rule-label">规则${['一', '二', '三'][index]}</span>
      <select class="shutdown-rule-condition"${fixedCondition ? ' disabled' : ''}>${conditionOptions}</select>
      <select class="shutdown-rule-operator"${fixedOperator ? ' disabled' : ''}>${operatorOptions}</select>
      <input class="shutdown-rule-value" type="number" min="0" step="1" placeholder="${condition ? '请输入' : '请先选择条件'}"${condition ? '' : ' disabled'}>
      <span class="shutdown-rule-unit"${unit ? '' : ' hidden'}>${unit}</span>
      <span class="shutdown-query-period"${showPeriod ? '' : ' hidden'}>查询数据周期近 <input class="shutdown-query-period-days" type="number" min="1" placeholder="请输入" aria-label="查询数据周期数值"> ${periodUnitControl} <em>（1代表当日）</em></span>
      ${index && !(fixedCondition && fixedOperator) ? '<button class="shutdown-rule-remove" type="button" aria-label="删除规则">×</button>' : ''}
    </div>`;
}

function renderShutdownRulePanel() {
  const isLongTermPlan = getSelectedShutdownFormPlanType() === '长期计划';
  const strategyKind = [...shutdownStrategyKindOptions].find((option) => option.checked)?.value || '自定义';
  let rules = [{ condition: '', operator: '' }];
  if (isLongTermPlan && strategyKind === '亏损/空耗监控') {
    rules = [
      { condition: '周期内消耗金额', operator: '>', fixedCondition: true, fixedOperator: true, periodUnitSwitch: true },
      { condition: '成交ROI', operator: '≤', fixedCondition: true, fixedOperator: true, periodUnitSwitch: true }
    ];
  } else if (isLongTermPlan && strategyKind === '低消监控') {
    rules = [
      { condition: '总消耗金额', operator: '≤', fixedCondition: true, fixedOperator: true },
      { condition: '实际加热时长', operator: '>', fixedCondition: true, fixedOperator: true, durationUnit: '天' }
    ];
  }
  shutdownRuleList.innerHTML = rules.map((rule, index) => createShutdownRuleRow({ index, ...rule })).join('');
  shutdownRuleList.querySelectorAll('.shutdown-rule-row').forEach(applyShutdownRuleValueConstraints);
  refreshShutdownRuleConditionOptions();
  const isFixedLongTermStrategy = isLongTermPlan && ['亏损/空耗监控', '低消监控'].includes(strategyKind);
  shutdownRulePanel.classList.toggle('is-fixed-strategy', isFixedLongTermStrategy);
  shutdownRuleActions.hidden = isFixedLongTermStrategy;
  shutdownRuleRelationAnd.checked = true;
  shutdownRuleRelationAnd.disabled = isFixedLongTermStrategy;
  shutdownRuleRelationOr.checked = false;
  shutdownRuleRelationOr.disabled = isFixedLongTermStrategy;
  shutdownOfflineWarning.hidden = true;
}

function updateShutdownRuleRow(row) {
  const condition = row.querySelector('.shutdown-rule-condition').value;
  const unit = getShutdownRuleUnit(condition, row.dataset.durationUnit || '天');
  const unitElement = row.querySelector('.shutdown-rule-unit');
  const periodElement = row.querySelector('.shutdown-query-period');
  unitElement.textContent = unit;
  unitElement.hidden = !unit;
  periodElement.hidden = !shutdownRuleNeedsPeriod(condition);
  applyShutdownRuleValueConstraints(row);
  refreshShutdownRuleConditionOptions();
}

function renumberShutdownRules() {
  [...shutdownRuleList.querySelectorAll('.shutdown-rule-row')].forEach((row, index) => {
    row.querySelector('.shutdown-rule-label').textContent = `规则${['一', '二', '三'][index]}`;
    const removeButton = row.querySelector('.shutdown-rule-remove');
    if (removeButton) removeButton.hidden = index === 0;
  });
}

function getShutdownRuleSummary() {
  return [...shutdownRuleList.querySelectorAll('.shutdown-rule-row')].map((row) => {
    const condition = row.querySelector('.shutdown-rule-condition').value || '未选择条件';
    const operator = row.querySelector('.shutdown-rule-operator').value || '';
    const value = row.querySelector('.shutdown-rule-value').value.trim();
    const unit = row.querySelector('.shutdown-rule-unit').textContent;
    const period = row.querySelector('.shutdown-query-period');
    const periodUnit = row.dataset.periodUnit || '天';
    const periodText = period.hidden ? '' : `（近${period.querySelector('input').value || '--'}${periodUnit}）`;
    return `${condition}${operator}${value}${unit}${periodText}`;
  }).join('；');
}

function getShutdownPeriodUnit() {
  return shutdownRuleList.querySelector('.shutdown-query-period-unit')?.value || '天';
}

function syncShutdownPeriodUnits(nextUnit) {
  shutdownRuleList.querySelectorAll('.shutdown-rule-row').forEach((row) => {
    row.dataset.periodUnit = nextUnit;
    const unitSelect = row.querySelector('.shutdown-query-period-unit');
    if (unitSelect) unitSelect.value = nextUnit;
    const period = row.querySelector('.shutdown-query-period');
    if (!period || period.hidden) return;
    const input = period.querySelector('.shutdown-query-period-days');
    input.value = '';
    input.max = nextUnit === '小时' ? '12' : '';
    period.querySelector('em').textContent = nextUnit === '小时' ? '（1代表当前近60分钟）' : '（1代表当日）';
  });
  shutdownOfflineWarning.hidden = nextUnit !== '小时';
  shutdownRestartInterval.value = '';
  shutdownRestartError.hidden = true;
  updateShutdownRestartModeAvailability();
  updateShutdownRestartDescription();
}

function updateShutdownRestartConfig() {
  const isEnabled = shutdownRestartToggle.classList.contains('is-on');
  shutdownRestartConfig.hidden = !isEnabled;
  if (!isEnabled) shutdownRestartError.hidden = true;
}

function setShutdownRestartEnabled(enabled) {
  shutdownRestartToggle.classList.toggle('is-on', enabled);
  shutdownRestartToggle.setAttribute('aria-pressed', String(enabled));
  updateShutdownRestartConfig();
}

function clearShutdownRestartConfig() {
  shutdownRestartInterval.value = '';
  shutdownRestartModeOptions.forEach((option) => { option.checked = option.value === '每日单次'; });
  shutdownRestartError.hidden = true;
}

function updateShutdownRestartAvailability() {
  const isLongTermPlan = getSelectedShutdownFormPlanType() === '长期计划';
  const strategyKind = [...shutdownStrategyKindOptions].find((option) => option.checked)?.value || '';
  const supported = isLongTermPlan && strategyKind === '亏损/空耗监控';
  shutdownRestartToggle.disabled = isLongTermPlan && !supported;
  shutdownRestartHint.hidden = !isLongTermPlan || supported;
  if (isLongTermPlan && !supported) {
    setShutdownRestartEnabled(false);
    clearShutdownRestartConfig();
  }
  updateShutdownRestartModeAvailability();
  updateShutdownRestartDescription();
}

function updateShutdownRestartModeAvailability() {
  const isHour = getShutdownPeriodUnit() === '小时';
  const cycleRadio = [...shutdownRestartModeOptions].find((option) => option.value === '循环止损');
  cycleRadio.disabled = !isHour;
  shutdownRestartCycleOption.classList.toggle('is-disabled', !isHour);
  if (!isHour && cycleRadio.checked) {
    shutdownRestartModeOptions.forEach((option) => { option.checked = option.value === '每日单次'; });
  }
}

function updateShutdownRestartDescription() {
  const mode = [...shutdownRestartModeOptions].find((option) => option.checked)?.value || '每日单次';
  if (mode === '循环止损') {
    const periods = [...shutdownRuleList.querySelectorAll('.shutdown-query-period:not([hidden]) .shutdown-query-period-days')]
      .map((input) => Number(input.value))
      .filter((value) => Number.isFinite(value) && value > 0);
    const observeHours = periods.length ? Math.max(...periods) : '--';
    shutdownRestartDescription.textContent = `重启后观察 ${observeHours} 小时，再次判断是否需要关停（按规则中的最长查询周期计算）；仅处理系统自动关停/恢复`;
  } else {
    shutdownRestartDescription.textContent = '同一计划在同一自然日仅执行 1 次系统“关停→恢复”，次日重新开始；人工暂停/恢复不触发本功能';
  }
}

function isIntegerInRange(value, min, max) {
  return /^\d+$/.test(value) && Number(value) >= min && Number(value) <= max;
}

function validateShutdownRules() {
  const rows = [...shutdownRuleList.querySelectorAll('.shutdown-rule-row')];
  const isLongTermPlan = getSelectedShutdownFormPlanType() === '长期计划';
  for (const row of rows) {
    const conditionSelect = row.querySelector('.shutdown-rule-condition');
    const operatorSelect = row.querySelector('.shutdown-rule-operator');
    const valueInput = row.querySelector('.shutdown-rule-value');
    const condition = conditionSelect.value;
    const value = valueInput.value.trim();
    if (!condition) { conditionSelect.focus(); return false; }
    if (!operatorSelect.value) { operatorSelect.focus(); return false; }
    let error = '';
    if (!value) error = '请输入规则数值';
    else if (isLongTermPlan && condition === '实际加热时长' && !isIntegerInRange(value, 1, 99)) error = '仅支持输入1～99的正整数';
    else if (isLongTermPlan && ['周期内消耗金额', '总消耗金额'].includes(condition) && !/^\d+$/.test(value)) error = '仅支持输入整数';
    else if (isLongTermPlan && condition === '成交ROI' && !/^\d+(\.\d{1,2})?$/.test(value)) error = '最多保留到小数点后两位';
    valueInput.setCustomValidity(error);
    if (error) { valueInput.reportValidity(); valueInput.focus(); return false; }
    const periodInput = row.querySelector('.shutdown-query-period:not([hidden]) .shutdown-query-period-days');
    const periodUnit = row.dataset.periodUnit || '天';
    if (periodInput && (periodUnit === '小时' ? !isIntegerInRange(periodInput.value.trim(), 1, 12) : !/^\d+$/.test(periodInput.value.trim()) || Number(periodInput.value) < 1)) {
      periodInput.setCustomValidity(periodUnit === '小时' ? '小时仅支持输入 1～12 的正整数' : '仅支持输入正整数');
      periodInput.reportValidity();
      periodInput.focus();
      return false;
    }
    if (periodInput) periodInput.setCustomValidity('');
  }
  return true;
}

function validateShutdownStrategyForm() {
  shutdownMonitorMethodError.hidden = shutdownMonitorMethod.checked;
  if (!shutdownMonitorMethod.checked) {
    shutdownMonitorMethod.focus();
    return false;
  }
  if (!validateShutdownRules()) return false;
  const isLongTermPlan = getSelectedShutdownFormPlanType() === '长期计划';
  if (isLongTermPlan && shutdownRestartToggle.classList.contains('is-on')) {
    if (!isIntegerInRange(shutdownRestartInterval.value.trim(), 1, 12)) {
      shutdownRestartError.textContent = '关停后间隔仅支持输入 1～12 的正整数';
      shutdownRestartError.hidden = false;
      shutdownRestartInterval.focus();
      return false;
    }
  }
  shutdownRestartError.hidden = true;
  return true;
}

function updateShutdownStrategyFormByPlanType() {
  const selectedPlanType = getSelectedShutdownFormPlanType();
  const isLongTermPlan = selectedPlanType === '长期计划';
  shutdownStrategyPlanType.value = selectedPlanType;
  shutdownStandardOnlySections.forEach((section) => {
    section.hidden = isLongTermPlan;
  });
  shutdownLongTermOnlySections.forEach((section) => {
    section.hidden = !isLongTermPlan;
  });
  const defaultStrategyKind = isLongTermPlan ? '亏损/空耗监控' : '自定义';
  shutdownStrategyKindOptions.forEach((option) => {
    option.checked = option.value === defaultStrategyKind;
  });
  shutdownStrategyType.value = defaultStrategyKind;
  renderShutdownRulePanel();
  clearShutdownRestartConfig();
  setShutdownRestartEnabled(isLongTermPlan);
  updateShutdownRestartAvailability();
}

function updateShutdownAccountScope() {
  const activeDimension = document.querySelector('[data-shutdown-dimension].is-selected')?.dataset.shutdownDimension;
  shutdownAccountScope.hidden = activeDimension !== '指定投放号';
}

function updateShutdownPartialScope(options, select) {
  const selectedValue = [...options].find((option) => option.checked)?.value;
  select.hidden = selectedValue !== 'partial';
}

function openShutdownModal(index = -1) {
  editingShutdownIndex = index;
  const row = index < 0 ? null : shutdownRows[index];
  shutdownDialogTitle.textContent = row ? '修改策略' : '新建策略';
  shutdownNameInput.value = row ? row.name : '';
  shutdownNameCount.textContent = String(shutdownNameInput.value.length);
  const formPlanType = row && ['标准计划', '长期计划'].includes(row.planType) ? row.planType : '标准计划';
  shutdownFormPlanTypeOptions.forEach((option) => {
    option.checked = option.value === formPlanType;
  });
  updateShutdownStrategyFormByPlanType();
  const allowedLongTermKinds = ['亏损/空耗监控', '低消监控'];
  const requestedStrategyKind = row ? row.strategyType : (formPlanType === '长期计划' ? '亏损/空耗监控' : '自定义');
  shutdownStrategyType.value = formPlanType === '长期计划' && !allowedLongTermKinds.includes(requestedStrategyKind) ? '亏损/空耗监控' : requestedStrategyKind;
  shutdownStrategyKindOptions.forEach((option) => { option.checked = option.value === shutdownStrategyType.value; });
  if (![...shutdownStrategyKindOptions].some((option) => option.checked)) {
    shutdownStrategyKindOptions[0].checked = true;
    shutdownStrategyType.value = shutdownStrategyKindOptions[0].value;
  }
  renderShutdownRulePanel();
  const activeDimension = row?.dimension === '投放号' ? '指定投放号' : '指定订单';
  shutdownDimensionOptions.forEach((option) => option.classList.toggle('is-selected', option.dataset.shutdownDimension === activeDimension));
  updateShutdownAccountScope();
  shutdownTargetScopeOptions.forEach((option) => { option.checked = option.value === 'all'; });
  shutdownMaterialScopeOptions.forEach((option) => { option.checked = option.value === 'all'; });
  updateShutdownPartialScope(shutdownTargetScopeOptions, shutdownTargetSelect);
  updateShutdownPartialScope(shutdownMaterialScopeOptions, shutdownMaterialSelect);
  clearShutdownRestartConfig();
  shutdownRestartError.hidden = true;
  shutdownMonitorMethod.checked = true;
  shutdownMonitorMethodError.hidden = true;
  const shouldEnableRestart = formPlanType === '长期计划' && shutdownStrategyType.value === '亏损/空耗监控';
  setShutdownRestartEnabled(shouldEnableRestart);
  updateShutdownRestartAvailability();
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
  if (!validateShutdownStrategyForm()) return;
  const planType = getSelectedShutdownFormPlanType();
  const selectedDimension = document.querySelector('[data-shutdown-dimension].is-selected')?.dataset.shutdownDimension || '指定订单';
  const dimension = selectedDimension === '指定投放号' ? '投放号' : '指定订单';
  const rule = getShutdownRuleSummary() || '消耗金额>1元';
  if (editingShutdownIndex < 0) {
    shutdownRows.unshift({ strategyType: shutdownStrategyType.value, name, planType, rule, dimension, method: planType === '长期计划' ? '自动暂停' : '自动关停', period: '全天', creator: '高良测试', createdAt: '2026-07-16 10:30:00', enabled: true });
  } else {
    Object.assign(shutdownRows[editingShutdownIndex], { strategyType: shutdownStrategyType.value, name, planType, rule, dimension });
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
  selectedShutdownPlanType = selectedShutdownPlanType === planType ? '' : planType;
  shutdownPlanTypeOptions.forEach((candidate) => {
    const isSelected = candidate.dataset.shutdownPlanType === selectedShutdownPlanType;
    candidate.classList.toggle('is-selected', isSelected);
    candidate.setAttribute('aria-pressed', String(isSelected));
  });
  updateShutdownPlanTypeLabel();
  closeShutdownPlanTypeFilter();
  renderShutdownTable();
});
document.addEventListener('click', (event) => {
  if (!shutdownPlanTypeFilter.contains(event.target)) closeShutdownPlanTypeFilter();
});
shutdownResetButton.addEventListener('click', () => {
  shutdownNameFilter.value = '';
  selectedShutdownPlanType = '';
  shutdownPlanTypeOptions.forEach((option) => {
    option.classList.remove('is-selected');
    option.setAttribute('aria-pressed', 'false');
  });
  updateShutdownPlanTypeLabel();
  closeShutdownPlanTypeFilter();
  document.querySelectorAll('.shutdown-filter select').forEach((select) => { select.selectedIndex = 0; });
  renderShutdownTable();
});
document.querySelectorAll('.shutdown-tabs button').forEach((button) => button.addEventListener('click', () => { document.querySelectorAll('.shutdown-tabs button').forEach((item) => item.classList.toggle('active', item === button)); }));

shutdownNameInput.addEventListener('input', () => {
  shutdownNameCount.textContent = String(shutdownNameInput.value.length);
});
shutdownDimensionOptions.forEach((option) => option.addEventListener('click', () => {
  shutdownDimensionOptions.forEach((candidate) => candidate.classList.toggle('is-selected', candidate === option));
  updateShutdownAccountScope();
}));
shutdownTargetScopeOptions.forEach((option) => option.addEventListener('change', () => {
  updateShutdownPartialScope(shutdownTargetScopeOptions, shutdownTargetSelect);
}));
shutdownMaterialScopeOptions.forEach((option) => option.addEventListener('change', () => {
  updateShutdownPartialScope(shutdownMaterialScopeOptions, shutdownMaterialSelect);
}));
shutdownFormPlanTypeOptions.forEach((option) => option.addEventListener('change', updateShutdownStrategyFormByPlanType));
shutdownStrategyKindOptions.forEach((option) => option.addEventListener('change', () => {
  if (option.checked) {
    shutdownStrategyType.value = option.value;
    renderShutdownRulePanel();
    updateShutdownRestartAvailability();
  }
}));
shutdownRuleList.addEventListener('change', (event) => {
  if (event.target.matches('.shutdown-rule-condition')) updateShutdownRuleRow(event.target.closest('.shutdown-rule-row'));
  if (event.target.matches('.shutdown-query-period-unit')) syncShutdownPeriodUnits(event.target.value);
});
shutdownRuleList.addEventListener('input', (event) => {
  if (event.target.matches('.shutdown-query-period-days')) updateShutdownRestartDescription();
});
shutdownRuleList.addEventListener('click', (event) => {
  const removeButton = event.target.closest('.shutdown-rule-remove');
  if (!removeButton) return;
  removeButton.closest('.shutdown-rule-row').remove();
  renumberShutdownRules();
  refreshShutdownRuleConditionOptions();
});
shutdownAddRuleButton.addEventListener('click', () => {
  const ruleCount = shutdownRuleList.querySelectorAll('.shutdown-rule-row').length;
  if (ruleCount >= 3) return;
  shutdownRuleList.insertAdjacentHTML('beforeend', createShutdownRuleRow({ index: ruleCount }));
  const newRow = shutdownRuleList.lastElementChild;
  applyShutdownRuleValueConstraints(newRow);
  refreshShutdownRuleConditionOptions();
});
shutdownMonitorMethod.addEventListener('change', () => {
  shutdownMonitorMethodError.hidden = shutdownMonitorMethod.checked;
});
shutdownRestartInterval.addEventListener('input', () => {
  shutdownRestartError.hidden = true;
});
shutdownRestartModeOptions.forEach((option) => option.addEventListener('change', updateShutdownRestartDescription));
document.querySelectorAll('.shutdown-mini-switch').forEach((button) => button.addEventListener('click', () => {
  if (button.disabled) return;
  const nextOn = !button.classList.contains('is-on');
  button.classList.toggle('is-on', nextOn);
  button.setAttribute('aria-pressed', String(nextOn));
  if (button === shutdownRestartToggle) updateShutdownRestartConfig();
}));

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
const deliveryAccountNoteFilter = document.querySelector('#delivery-account-note-filter');
const deliveryAccountStatusFilter = document.querySelector('#delivery-account-status-filter');
const offlineReminderModal = document.querySelector('#offline-reminder-modal');

function renderDeliveryAccountTable() {
  const keyword = deliveryAccountNameFilter.value.trim().toLowerCase();
  const noteKeyword = deliveryAccountNoteFilter.value.trim().toLowerCase();
  const status = deliveryAccountStatusFilter.value;
  const rows = deliveryAccountRows.filter((row) => (!keyword || row.name.toLowerCase().includes(keyword)) && (!noteKeyword || row.note.toLowerCase().includes(noteKeyword)) && (!status || row.status === status));
  deliveryAccountTableBody.innerHTML = rows.map((row) => `
    <tr><td><div class="delivery-account-name"><span class="delivery-account-avatar">${row.name.slice(0, 1)}</span><span>${escapeAudienceText(row.name)}</span></div></td><td>${escapeAudienceText(row.note)}　✎</td><td>${row.kind}</td><td><span class="${row.status === '在线' ? 'account-online' : 'account-offline'}">${row.status}</span></td><td>${row.countdown}</td><td class="delivery-account-balance">${row.balance}</td><td class="delivery-account-partner">合作作者：${row.partners}人<br><button class="delivery-account-link is-orange" type="button">详情</button></td><td>${row.login}</td><td><button class="delivery-account-link" type="button">重新授权</button>${row.status === '在线' ? '<button class="delivery-account-link" type="button">取消授权</button><button class="delivery-account-link" type="button">分身登录</button>' : ''}</td></tr>
  `).join('');
  document.querySelector('#delivery-account-total').textContent = keyword || noteKeyword || status ? `共 ${rows.length} 条` : '共 41 条';
}

deliveryAccountNameFilter.addEventListener('input', renderDeliveryAccountTable);
deliveryAccountNoteFilter.addEventListener('input', renderDeliveryAccountTable);
deliveryAccountStatusFilter.addEventListener('change', renderDeliveryAccountTable);
document.querySelector('#delivery-account-reset').addEventListener('click', () => { deliveryAccountNameFilter.value = ''; deliveryAccountNoteFilter.value = ''; deliveryAccountStatusFilter.value = ''; renderDeliveryAccountTable(); });
document.querySelector('#delivery-account-refresh').addEventListener('click', (event) => { event.currentTarget.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], { duration: 420 }); renderDeliveryAccountTable(); });

function closeOfflineReminder() { offlineReminderModal.hidden = true; }
document.querySelector('#offline-reminder-settings').addEventListener('click', () => { offlineReminderModal.hidden = false; });
document.querySelector('#close-offline-reminder').addEventListener('click', closeOfflineReminder);
document.querySelector('#cancel-offline-reminder').addEventListener('click', closeOfflineReminder);
document.querySelector('#save-offline-reminder').addEventListener('click', closeOfflineReminder);
offlineReminderModal.addEventListener('click', (event) => { if (event.target === offlineReminderModal) closeOfflineReminder(); });

renderShutdownTable();
renderDeliveryAccountTable();
