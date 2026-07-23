const countValue = document.querySelector('#plan-count');
const orderCount = document.querySelector('#order-count');
const orderTotal = document.querySelector('#order-total');
const dailyBudgetOptions = document.querySelector('#daily-budget-options');
const customDailyBudget = document.querySelector('#custom-daily-budget');
const customBudgetRow = document.querySelector('.custom-budget-row');
const budgetRow = document.querySelector('.budget-row');
const priorityTarget = document.querySelector('#priority-target');
const authorCustomerRow = document.querySelector('#author-customer-row');
const authorCustomerInputs = document.querySelectorAll('input[name="author-customer"]');
const authorCustomerConfirm = document.querySelector('#author-customer-confirm');
const cancelAuthorCustomer = document.querySelector('#cancel-author-customer');
const confirmAuthorCustomer = document.querySelector('#confirm-author-customer');
const switches = document.querySelectorAll('.switch');
const submitButton = document.querySelector('#submit-plan');
const successToast = document.querySelector('#success-toast');
const confirmCreateLayer = document.querySelector('#confirm-create-layer');
const cancelConfirmCreate = document.querySelector('#cancel-confirm-create');
const confirmCreate = document.querySelector('#confirm-create');
const confirmPlanCount = document.querySelector('#confirm-plan-count');
const confirmPriorityTarget = document.querySelector('#confirm-priority-target');
const confirmDailyBudget = document.querySelector('#confirm-daily-budget');
const confirmHeatingPeriod = document.querySelector('#confirm-heating-period');
const planName = document.querySelector('#plan-name');
const deliveryAccountName = document.querySelector('#delivery-account-name');
const heatingAccount = document.querySelector('#heating-account');
const heatingStartDate = document.querySelector('#heating-start-date');
const heatingEndDate = document.querySelector('#heating-end-date');
const directHeatingMaterial = document.querySelector('#direct-heating-material');
const planNameError = document.querySelector('#plan-name-error');
const heatingAccountError = document.querySelector('#heating-account-error');
const dailyBudgetError = document.querySelector('#daily-budget-error');
const heatingPeriodControl = document.querySelector('#heating-period-control');
const heatingPeriodError = document.querySelector('#heating-period-error');
const heatingMaterialControl = document.querySelector('#heating-material-control');
const heatingMaterialError = document.querySelector('#heating-material-error');
const shortVideoMaterialError = document.querySelector('#short-video-material-error');
const paymentOrderLayer = document.querySelector('#payment-order-layer');
const closePaymentOrder = document.querySelector('#close-payment-order');
const cancelPaymentOrder = document.querySelector('#cancel-payment-order');
const confirmPaymentOrder = document.querySelector('#confirm-payment-order');
const pendingPaymentCount = document.querySelector('#pending-payment-count');
const paymentOrderBody = document.querySelector('#payment-order-body');
const accountWarningToast = document.querySelector('#account-warning-toast');
const shutdownStrategySwitch = document.querySelector('#shutdown-strategy-switch');
const shutdownStrategySelect = document.querySelector('#shutdown-strategy-select');
const shutdownStrategyTrigger = document.querySelector('#shutdown-strategy-trigger');
const shutdownStrategyTags = document.querySelector('#shutdown-strategy-tags');
const shutdownStrategyOptions = document.querySelector('#shutdown-strategy-options');
const shortVideoHeatingMaterial = document.querySelector('#short-video-heating-material');
const shortVideoMaterialRow = document.querySelector('#short-video-material-row');
const openVideoSelector = document.querySelector('#open-video-selector');
const videoSelectorLayer = document.querySelector('#video-selector-layer');
const closeVideoSelector = document.querySelector('#close-video-selector');
const cancelVideoSelector = document.querySelector('#cancel-video-selector');
const confirmVideoSelector = document.querySelector('#confirm-video-selector');
const videoSelectedCount = document.querySelector('#video-selected-count');
const videoSelectedChips = document.querySelector('#video-selected-chips');
const videoSelectorBody = document.querySelector('#video-selector-body');
const videoSelectAll = document.querySelector('#video-select-all');
const videoSelectionFilter = document.querySelector('#video-selection-filter');
const videoSelectionFilterTrigger = document.querySelector('#video-selection-filter-trigger');
const videoSelectionFilterLabel = document.querySelector('#video-selection-filter-label');
const videoSelectionFilterPanel = document.querySelector('#video-selection-filter-panel');
const videoSelectionFilterOptions = videoSelectionFilterPanel.querySelectorAll('[data-video-selection-filter]');
const selectedVideoTags = document.querySelector('#selected-video-tags');
const selectedVideoCoverPreview = document.querySelector('#selected-video-cover-preview');

let planCount = 1;
let selectedAmount = Number(dailyBudgetOptions.querySelector('input[name="daily-budget"]:checked')?.value || 100);
let authorCustomerValue = 'all';
let pendingAuthorCustomerValue = null;
let authorCustomerConfirmed = false;
const selectedVideoIds = new Set();
let draftSelectedVideoIds = new Set();
const selectedVideoFilterStates = new Set();
const videoOptions = [
  { id: 'video-1', name: '润喉糖', description: '润喉清凉', cy: 'CY100004906767', tag: '13', value: '未投放', time: '2026-06-17 15:27:19', uploader: '高良测试', thumb: 'video-thumb-1' },
  { id: 'video-2', name: '榴莲 - 副本 (2)', description: '榴莲小店查看', cy: 'CY100004824029', tag: '--', value: '低效', time: '2026-06-08 18:13:34', uploader: '高良测试', thumb: 'video-thumb-2' },
  { id: 'video-3', name: '微信视频2026-06-06_033', description: 'q前期', cy: 'CY100004716066', tag: '--', value: '探索', time: '2026-06-06 17:59:54', uploader: '高良测试', thumb: 'video-thumb-3' },
  { id: 'video-4', name: '夏日溪流', description: '自然风景短视频', cy: 'CY100004701825', tag: '8', value: '高潜', time: '2026-06-05 16:42:20', uploader: '高良测试', thumb: 'video-thumb-4' },
  { id: 'video-5', name: '清晨咖啡馆', description: '城市生活记录', cy: 'CY100004698231', tag: '生活', value: '高潜', time: '2026-06-04 10:20:18', uploader: '运营小畅', thumb: 'video-thumb-1' },
  { id: 'video-6', name: '夏季防晒指南', description: '防晒产品讲解', cy: 'CY100004682170', tag: '种草', value: '探索', time: '2026-06-03 14:35:42', uploader: '运营小畅', thumb: 'video-thumb-2' },
  { id: 'video-7', name: '办公室拉伸', description: '三分钟肩颈放松', cy: 'CY100004671126', tag: '健康', value: '低效', time: '2026-06-02 09:16:05', uploader: '内容测试', thumb: 'video-thumb-3' },
  { id: 'video-8', name: '周末露营清单', description: '新手露营装备推荐', cy: 'CY100004660981', tag: '户外', value: '高潜', time: '2026-06-01 18:08:36', uploader: '内容测试', thumb: 'video-thumb-4' },
  { id: 'video-9', name: '低脂早餐合集', description: '一周早餐不重样', cy: 'CY100004653210', tag: '美食', value: '探索', time: '2026-05-30 08:45:29', uploader: '高良测试', thumb: 'video-thumb-1' },
  { id: 'video-10', name: '猫咪的午后', description: '萌宠日常片段', cy: 'CY100004642765', tag: '萌宠', value: '高潜', time: '2026-05-29 15:22:47', uploader: '高良测试', thumb: 'video-thumb-2' },
  { id: 'video-11', name: '通勤穿搭示范', description: '简约职场穿搭', cy: 'CY100004631028', tag: '穿搭', value: '探索', time: '2026-05-28 11:09:13', uploader: '运营小畅', thumb: 'video-thumb-3' },
  { id: 'video-12', name: '居家收纳技巧', description: '小空间收纳改造', cy: 'CY100004620577', tag: '家居', value: '高潜', time: '2026-05-27 16:54:38', uploader: '运营小畅', thumb: 'video-thumb-4' },
  { id: 'video-13', name: '夜跑城市路线', description: '城市夜景跑步路线', cy: 'CY100004612309', tag: '运动', value: '低效', time: '2026-05-26 20:31:52', uploader: '内容测试', thumb: 'video-thumb-1' },
  { id: 'video-14', name: '一分钟妆容', description: '快速通勤妆教程', cy: 'CY100004601843', tag: '美妆', value: '探索', time: '2026-05-25 07:48:06', uploader: '内容测试', thumb: 'video-thumb-2' },
  { id: 'video-15', name: '海边落日延时', description: '海边黄昏延时摄影', cy: 'CY100004590214', tag: '风景', value: '高潜', time: '2026-05-24 19:26:14', uploader: '高良测试', thumb: 'video-thumb-3' },
  { id: 'video-16', name: '新品开箱实测', description: '新品功能真实体验', cy: 'CY100004581906', tag: '测评', value: '探索', time: '2026-05-23 13:12:33', uploader: '高良测试', thumb: 'video-thumb-4' }
];

function updateOrderSummary() {
  countValue.textContent = String(planCount);
  orderCount.textContent = `${planCount}个`;
  orderTotal.textContent = `￥${(selectedAmount * planCount).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function setFieldValidation(control, errorElement, invalid) {
  control.classList.toggle('is-error-control', invalid);
  errorElement.hidden = !invalid;
}

function validateCreateForm() {
  const customOption = dailyBudgetOptions.querySelector('input[value="custom"]');
  const budgetControl = customOption.checked ? customDailyBudget : dailyBudgetOptions;
  const invalidPlanName = !planName.value.trim();
  const invalidHeatingAccount = !heatingAccount.value;
  const invalidBudget = !Number.isFinite(selectedAmount) || selectedAmount < 100 || selectedAmount > 300000;
  const invalidPeriod = !heatingStartDate.value || !heatingEndDate.value || heatingStartDate.value > heatingEndDate.value;
  const invalidMaterial = !directHeatingMaterial.checked && !shortVideoHeatingMaterial.checked;
  const invalidShortVideo = shortVideoHeatingMaterial.checked && selectedVideoIds.size === 0;

  setFieldValidation(planName, planNameError, invalidPlanName);
  setFieldValidation(heatingAccount.closest('.native-select'), heatingAccountError, invalidHeatingAccount);
  setFieldValidation(budgetControl, dailyBudgetError, invalidBudget);
  setFieldValidation(heatingPeriodControl, heatingPeriodError, invalidPeriod);
  setFieldValidation(heatingMaterialControl, heatingMaterialError, invalidMaterial);
  setFieldValidation(openVideoSelector, shortVideoMaterialError, invalidShortVideo);

  const firstInvalidControl = [
    invalidPlanName && planName,
    invalidHeatingAccount && heatingAccount,
    invalidBudget && budgetControl,
    invalidPeriod && heatingStartDate,
    invalidMaterial && directHeatingMaterial,
    invalidShortVideo && openVideoSelector
  ].find(Boolean);
  if (firstInvalidControl) {
    firstInvalidControl.focus();
    firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return false;
  }
  return true;
}

function syncCustomBudgetVisibility() {
  const customOption = dailyBudgetOptions.querySelector('input[value="custom"]');
  customBudgetRow.hidden = !customOption.checked;
  budgetRow.classList.toggle('is-custom', customOption.checked);
}

function syncAuthorCustomerVisibility() {
  const hiddenAuthorCustomerTargets = new Set(['viewer', 'interaction', 'followers', 'roi']);
  authorCustomerRow.hidden = hiddenAuthorCustomerTargets.has(priorityTarget.value);
  if (authorCustomerRow.hidden && pendingAuthorCustomerValue) {
    authorCustomerInputs.forEach((input) => {
      input.checked = input.value === authorCustomerValue;
    });
    pendingAuthorCustomerValue = null;
    authorCustomerConfirm.hidden = true;
  }
}

document.querySelectorAll('[data-step]').forEach((button) => {
  button.addEventListener('click', () => {
    planCount = Math.min(99, Math.max(1, planCount + Number(button.dataset.step)));
    updateOrderSummary();
  });
});

dailyBudgetOptions.addEventListener('change', (event) => {
  if (event.target.name !== 'daily-budget') return;
  selectedAmount = event.target.value === 'custom' ? Number(customDailyBudget.value || 0) : Number(event.target.value);
  syncCustomBudgetVisibility();
  updateOrderSummary();
  setFieldValidation(customDailyBudget, dailyBudgetError, false);
  dailyBudgetOptions.classList.remove('is-error-control');
});

customDailyBudget.addEventListener('input', () => {
  const customOption = dailyBudgetOptions.querySelector('input[value="custom"]');
  if (!customOption.checked) customOption.checked = true;
  syncCustomBudgetVisibility();
  selectedAmount = Number(customDailyBudget.value || 0);
  updateOrderSummary();
  setFieldValidation(customDailyBudget, dailyBudgetError, false);
});

priorityTarget.addEventListener('change', syncAuthorCustomerVisibility);

authorCustomerInputs.forEach((input) => {
  input.addEventListener('change', () => {
    if (authorCustomerValue === 'all' && input.value !== 'all' && !authorCustomerConfirmed) {
      pendingAuthorCustomerValue = input.value;
      authorCustomerInputs.forEach((item) => {
        item.checked = item.value === authorCustomerValue;
      });
      authorCustomerConfirm.hidden = false;
      return;
    }
    authorCustomerValue = input.value;
  });
});

cancelAuthorCustomer.addEventListener('click', () => {
  pendingAuthorCustomerValue = null;
  authorCustomerInputs.forEach((input) => {
    input.checked = input.value === authorCustomerValue;
  });
  authorCustomerConfirm.hidden = true;
});

confirmAuthorCustomer.addEventListener('click', () => {
  if (!pendingAuthorCustomerValue) return;
  authorCustomerValue = pendingAuthorCustomerValue;
  pendingAuthorCustomerValue = null;
  authorCustomerConfirmed = true;
  authorCustomerInputs.forEach((input) => {
    input.checked = input.value === authorCustomerValue;
  });
  authorCustomerConfirm.hidden = true;
});

switches.forEach((control) => {
  control.addEventListener('click', () => {
    control.setAttribute('aria-checked', String(control.getAttribute('aria-checked') !== 'true'));
  });
});

function renderShutdownStrategyTags() {
  const selectedOptions = Array.from(shutdownStrategyOptions.querySelectorAll('input:checked'));
  shutdownStrategyTags.innerHTML = selectedOptions.length
    ? selectedOptions.map((option) => `<span class="shutdown-strategy-chip">${option.value}<i data-remove-strategy="${option.value}" aria-label="移除${option.value}">×</i></span>`).join('')
    : '<em>请选择关停策略</em>';
}

shutdownStrategySwitch.addEventListener('click', () => {
  const enabled = shutdownStrategySwitch.getAttribute('aria-checked') === 'true';
  shutdownStrategySelect.hidden = !enabled;
  if (!enabled) {
    shutdownStrategyOptions.hidden = true;
    shutdownStrategyTrigger.setAttribute('aria-expanded', 'false');
  }
});

shutdownStrategyTrigger.addEventListener('click', (event) => {
  const removeButton = event.target.closest('[data-remove-strategy]');
  if (removeButton) {
    const option = Array.from(shutdownStrategyOptions.querySelectorAll('input')).find((input) => input.value === removeButton.dataset.removeStrategy);
    if (option) option.checked = false;
    renderShutdownStrategyTags();
    return;
  }
  const willOpen = shutdownStrategyOptions.hidden;
  shutdownStrategyOptions.hidden = !willOpen;
  shutdownStrategyTrigger.setAttribute('aria-expanded', String(willOpen));
});

shutdownStrategyOptions.addEventListener('change', renderShutdownStrategyTags);

function getFilteredVideoOptions() {
  if (selectedVideoFilterStates.size !== 1) return videoOptions;
  if (selectedVideoFilterStates.has('selected')) return videoOptions.filter((video) => draftSelectedVideoIds.has(video.id));
  if (selectedVideoFilterStates.has('unselected')) return videoOptions.filter((video) => !draftSelectedVideoIds.has(video.id));
  return videoOptions;
}

function closeVideoSelectionFilter() {
  videoSelectionFilterPanel.hidden = true;
  videoSelectionFilterTrigger.setAttribute('aria-expanded', 'false');
}

function updateVideoSelectionFilter() {
  const selectedCount = draftSelectedVideoIds.size;
  const unselectedCount = videoOptions.length - selectedCount;
  videoSelectionFilterPanel.querySelector('[data-video-selection-count="selected"]').textContent = String(selectedCount);
  videoSelectionFilterPanel.querySelector('[data-video-selection-count="unselected"]').textContent = String(unselectedCount);
  if (selectedVideoFilterStates.size === 0) videoSelectionFilterLabel.textContent = `全部素材（${videoOptions.length}）`;
  else if (selectedVideoFilterStates.size === 2) videoSelectionFilterLabel.textContent = `已选、未选（${videoOptions.length}）`;
  else if (selectedVideoFilterStates.has('selected')) videoSelectionFilterLabel.textContent = `已选（${selectedCount}）`;
  else videoSelectionFilterLabel.textContent = `未选（${unselectedCount}）`;
}

function renderSelectedVideoTags() {
  const selectedVideos = videoOptions.filter((video) => selectedVideoIds.has(video.id));
  openVideoSelector.textContent = selectedVideos.length ? `已选择 ${selectedVideos.length}个视频 >` : '请选择短视频';
  selectedVideoTags.innerHTML = selectedVideos.map((video) => `<span><i class="selected-video-cover ${video.thumb}" data-preview-video="${video.id}" tabindex="0" aria-label="预览${video.name}封面"></i><em>${video.name}</em><button type="button" data-remove-selected-video="${video.id}" aria-label="移除${video.name}">×</button></span>`).join('');
}

function showSelectedVideoCoverPreview(cover) {
  const video = videoOptions.find((item) => item.id === cover.dataset.previewVideo);
  if (!video) return;
  const coverRect = cover.getBoundingClientRect();
  const previewWidth = 168;
  const previewHeight = 228;
  const left = Math.min(Math.max(8, coverRect.left), window.innerWidth - previewWidth - 8);
  const top = coverRect.top >= previewHeight + 10 ? coverRect.top - previewHeight - 8 : coverRect.bottom + 8;
  selectedVideoCoverPreview.className = `selected-video-cover-preview ${video.thumb}`;
  selectedVideoCoverPreview.style.left = `${left}px`;
  selectedVideoCoverPreview.style.top = `${top}px`;
  selectedVideoCoverPreview.querySelector('span').textContent = video.name;
  selectedVideoCoverPreview.setAttribute('aria-label', `${video.name}封面预览`);
  selectedVideoCoverPreview.hidden = false;
}

function hideSelectedVideoCoverPreview() {
  selectedVideoCoverPreview.hidden = true;
}

function renderVideoSelector() {
  const filteredVideoOptions = getFilteredVideoOptions();
  const selectedCount = draftSelectedVideoIds.size;
  updateVideoSelectionFilter();
  videoSelectedCount.textContent = `已选${draftSelectedVideoIds.size}/50`;
  videoSelectedChips.innerHTML = [...draftSelectedVideoIds].map((videoId) => {
    const video = videoOptions.find((item) => item.id === videoId);
    return `<span><i class="${video.thumb}"></i>${video.name}<b data-remove-video="${video.id}">×</b></span>`;
  }).join('');
  videoSelectorBody.innerHTML = filteredVideoOptions.length ? filteredVideoOptions.map((video) => `
    <tr class="${draftSelectedVideoIds.has(video.id) ? 'is-selected' : ''}">
      <td><input type="checkbox" data-video-id="${video.id}" ${draftSelectedVideoIds.has(video.id) ? 'checked' : ''}></td>
      <td><div class="video-name-cell"><i class="${video.thumb}"></i><span><strong>${video.name}</strong><em>${video.description}</em><small>${video.cy}</small></span></div></td>
      <td>${video.tag}</td><td>微信豆：　${video.value}<br>小店：　${video.value}<br>ADQ：　未投放</td><td>￥0.00</td><td>0%</td><td>0</td><td>${video.time}</td><td>${video.uploader}</td>
    </tr>
  `).join('') : `<tr><td class="video-empty-state" colspan="9">${selectedVideoFilterStates.has('selected') ? '暂无已选素材' : selectedVideoFilterStates.has('unselected') ? '暂无未选素材，当前结果已全部选择' : '暂无符合条件的素材'}</td></tr>`;
  const filteredSelectedCount = filteredVideoOptions.filter((video) => draftSelectedVideoIds.has(video.id)).length;
  videoSelectAll.checked = filteredVideoOptions.length > 0 && filteredSelectedCount === filteredVideoOptions.length;
  videoSelectAll.indeterminate = filteredSelectedCount > 0 && filteredSelectedCount < filteredVideoOptions.length;
  videoSelectAll.disabled = filteredVideoOptions.length === 0;
}

shortVideoHeatingMaterial.addEventListener('change', () => {
  shortVideoMaterialRow.hidden = !shortVideoHeatingMaterial.checked;
  if (!shortVideoHeatingMaterial.checked) videoSelectorLayer.hidden = true;
  setFieldValidation(heatingMaterialControl, heatingMaterialError, false);
  if (!shortVideoHeatingMaterial.checked) setFieldValidation(openVideoSelector, shortVideoMaterialError, false);
});

directHeatingMaterial.addEventListener('change', () => setFieldValidation(heatingMaterialControl, heatingMaterialError, false));

openVideoSelector.addEventListener('click', () => {
  if (!heatingAccount.value) {
    setFieldValidation(heatingAccount.closest('.native-select'), heatingAccountError, true);
    accountWarningToast.hidden = false;
    window.clearTimeout(accountWarningToast.hideTimer);
    accountWarningToast.hideTimer = window.setTimeout(() => { accountWarningToast.hidden = true; }, 1800);
    heatingAccount.focus();
    return;
  }
  draftSelectedVideoIds = new Set(selectedVideoIds);
  selectedVideoFilterStates.clear();
  videoSelectionFilterOptions.forEach((option) => {
    option.classList.remove('is-selected');
    option.setAttribute('aria-selected', 'false');
  });
  closeVideoSelectionFilter();
  renderVideoSelector();
  videoSelectorLayer.hidden = false;
});

function hideVideoSelector() {
  draftSelectedVideoIds = new Set(selectedVideoIds);
  videoSelectorLayer.hidden = true;
}

closeVideoSelector.addEventListener('click', hideVideoSelector);
cancelVideoSelector.addEventListener('click', hideVideoSelector);

videoSelectorBody.addEventListener('change', (event) => {
  const checkbox = event.target.closest('[data-video-id]');
  if (!checkbox) return;
  if (checkbox.checked && draftSelectedVideoIds.size >= 50) {
    checkbox.checked = false;
    return;
  }
  if (checkbox.checked) draftSelectedVideoIds.add(checkbox.dataset.videoId);
  else draftSelectedVideoIds.delete(checkbox.dataset.videoId);
  renderVideoSelector();
});

videoSelectedChips.addEventListener('click', (event) => {
  const removeButton = event.target.closest('[data-remove-video]');
  if (!removeButton) return;
  draftSelectedVideoIds.delete(removeButton.dataset.removeVideo);
  renderVideoSelector();
});

videoSelectAll.addEventListener('change', () => {
  const filteredVideoOptions = getFilteredVideoOptions();
  if (videoSelectAll.checked) {
    filteredVideoOptions.forEach((video) => {
      if (draftSelectedVideoIds.size < 50) draftSelectedVideoIds.add(video.id);
    });
  } else {
    filteredVideoOptions.forEach((video) => draftSelectedVideoIds.delete(video.id));
  }
  renderVideoSelector();
});

videoSelectionFilterTrigger.addEventListener('click', () => {
  const nextOpen = videoSelectionFilterPanel.hidden;
  videoSelectionFilterPanel.hidden = !nextOpen;
  videoSelectionFilterTrigger.setAttribute('aria-expanded', String(nextOpen));
});

videoSelectionFilterPanel.addEventListener('click', (event) => {
  const option = event.target.closest('[data-video-selection-filter]');
  if (!option) return;
  const filterState = option.dataset.videoSelectionFilter;
  if (selectedVideoFilterStates.has(filterState)) selectedVideoFilterStates.delete(filterState);
  else selectedVideoFilterStates.add(filterState);
  const isSelected = selectedVideoFilterStates.has(filterState);
  option.classList.toggle('is-selected', isSelected);
  option.setAttribute('aria-selected', String(isSelected));
  renderVideoSelector();
});

document.addEventListener('click', (event) => {
  if (!videoSelectionFilter.contains(event.target)) closeVideoSelectionFilter();
});

selectedVideoTags.addEventListener('click', (event) => {
  const removeButton = event.target.closest('[data-remove-selected-video]');
  if (!removeButton) return;
  selectedVideoIds.delete(removeButton.dataset.removeSelectedVideo);
  renderSelectedVideoTags();
  setFieldValidation(openVideoSelector, shortVideoMaterialError, shortVideoHeatingMaterial.checked && selectedVideoIds.size === 0);
});

selectedVideoTags.addEventListener('mouseover', (event) => {
  const cover = event.target.closest('[data-preview-video]');
  if (cover) showSelectedVideoCoverPreview(cover);
});

selectedVideoTags.addEventListener('mouseout', (event) => {
  if (event.target.closest('[data-preview-video]')) hideSelectedVideoCoverPreview();
});

selectedVideoTags.addEventListener('focusin', (event) => {
  const cover = event.target.closest('[data-preview-video]');
  if (cover) showSelectedVideoCoverPreview(cover);
});

selectedVideoTags.addEventListener('focusout', (event) => {
  if (event.target.closest('[data-preview-video]')) hideSelectedVideoCoverPreview();
});

confirmVideoSelector.addEventListener('click', () => {
  selectedVideoIds.clear();
  draftSelectedVideoIds.forEach((videoId) => selectedVideoIds.add(videoId));
  renderSelectedVideoTags();
  setFieldValidation(openVideoSelector, shortVideoMaterialError, selectedVideoIds.size === 0);
  hideVideoSelector();
});

planName.addEventListener('input', () => setFieldValidation(planName, planNameError, false));
heatingAccount.addEventListener('change', () => {
  setFieldValidation(heatingAccount.closest('.native-select'), heatingAccountError, false);
  accountWarningToast.hidden = true;
});
[heatingStartDate, heatingEndDate].forEach((input) => input.addEventListener('change', () => setFieldValidation(heatingPeriodControl, heatingPeriodError, false)));

document.querySelectorAll('.top-nav a[href="#"], .icon-rail a[href="#"]').forEach((link) => {
  link.addEventListener('click', (event) => event.preventDefault());
});

document.addEventListener('click', (event) => {
  if (shutdownStrategySelect.hidden || shutdownStrategySelect.contains(event.target)) return;
  shutdownStrategyOptions.hidden = true;
  shutdownStrategyTrigger.setAttribute('aria-expanded', 'false');
});

submitButton.addEventListener('click', () => {
  if (!validateCreateForm()) return;
  confirmPlanCount.textContent = `${planCount}个`;
  confirmPriorityTarget.textContent = priorityTarget.options[priorityTarget.selectedIndex].textContent;
  confirmDailyBudget.textContent = `￥${selectedAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  confirmHeatingPeriod.textContent = `${heatingStartDate.value} - ${heatingEndDate.value}`;
  confirmCreateLayer.hidden = false;
});

cancelConfirmCreate.addEventListener('click', () => {
  confirmCreateLayer.hidden = true;
});

function renderPaymentOrders() {
  const basePlanName = planName.value.trim();
  const selectedDeliveryAccount = deliveryAccountName.textContent.trim();
  const priorityTargetName = priorityTarget.options[priorityTarget.selectedIndex].textContent;
  const dailyBudget = `￥${selectedAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  pendingPaymentCount.textContent = String(planCount);
  paymentOrderBody.innerHTML = Array.from({ length: planCount }, (_, index) => {
    const currentPlanName = planCount === 1 ? basePlanName : `${basePlanName}${String(index + 1).padStart(2, '0')}`;
    return `<tr><td>${currentPlanName}</td><td>${selectedDeliveryAccount}</td><td>${priorityTargetName}</td><td>1微信豆</td><td>${dailyBudget}</td><td><button class="payment-qr" type="button" data-payment-qr aria-label="放大${currentPlanName}支付二维码"></button></td></tr>`;
  }).join('');
}

confirmCreate.addEventListener('click', () => {
  confirmCreateLayer.hidden = true;
  renderPaymentOrders();
  paymentOrderLayer.hidden = false;
});

function hidePaymentOrder() {
  paymentOrderLayer.hidden = true;
}

closePaymentOrder.addEventListener('click', hidePaymentOrder);
cancelPaymentOrder.addEventListener('click', hidePaymentOrder);
confirmPaymentOrder.addEventListener('click', () => {
  hidePaymentOrder();
  successToast.hidden = false;
  window.setTimeout(() => { successToast.hidden = true; }, 1600);
});

paymentOrderBody.addEventListener('click', (event) => {
  const qrCode = event.target.closest('[data-payment-qr]');
  if (!qrCode) return;
  paymentOrderBody.querySelectorAll('[data-payment-qr]').forEach((item) => {
    if (item !== qrCode) item.classList.remove('is-enlarged');
  });
  qrCode.classList.toggle('is-enlarged');
});

syncCustomBudgetVisibility();
syncAuthorCustomerVisibility();
renderShutdownStrategyTags();
updateOrderSummary();
