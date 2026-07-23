# 长期计划产品原型

该项目使用 Flask 提供本地静态原型页面。

## 启动

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
gunicorn -b 0.0.0.0:8000 app:app
```

开发环境也可以直接运行：

```bash
python app.py
```

启动后访问：

- `http://服务器地址:8000/`：长期计划
- `http://服务器地址:8000/新建长期计划.html`：新建长期计划
- `http://服务器地址:8000/health`：健康检查
