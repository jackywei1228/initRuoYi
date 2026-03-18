<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="88px">
      <el-form-item label="等级名称" prop="levelName">
        <el-input
          v-model="queryParams.levelName"
          placeholder="请输入等级名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['pms:distributorLevel:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['pms:distributorLevel:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['pms:distributorLevel:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="levelList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="等级名称" align="center" prop="levelName" />
      <el-table-column label="折扣率(%)" align="center" prop="discountRate">
        <template slot-scope="scope">
          <el-tag type="success">{{ scope.row.discountRate }}%</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="可见DBP" align="center" prop="visibleDbp">
        <template slot-scope="scope">
          <el-tag :type="scope.row.visibleDbp === 1 ? 'success' : 'danger'">
            {{ scope.row.visibleDbp === 1 ? '可见' : '不可见' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="可见RRP" align="center" prop="visibleRrp">
        <template slot-scope="scope">
          <el-tag :type="scope.row.visibleRrp === 1 ? 'success' : 'danger'">
            {{ scope.row.visibleRrp === 1 ? '可见' : '不可见' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="优先级" align="center" prop="priority" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['pms:distributorLevel:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['pms:distributorLevel:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改经销商等级对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="等级名称" prop="levelName">
          <el-input v-model="form.levelName" placeholder="请输入等级名称" />
        </el-form-item>
        <el-form-item label="折扣率(%)" prop="discountRate">
          <el-input-number v-model="form.discountRate" :min="0" :max="100" :precision="2" placeholder="请输入折扣率" />
        </el-form-item>
        <el-form-item label="可见DBP" prop="visibleDbp">
          <el-checkbox v-model="form.visibleDbp" :true-label="1" :false-label="0">可查看DBP价格</el-checkbox>
        </el-form-item>
        <el-form-item label="可见RRP" prop="visibleRrp">
          <el-checkbox v-model="form.visibleRrp" :true-label="1" :false-label="0">可查看RRP价格</el-checkbox>
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-input-number v-model="form.priority" :min="1" :max="100" placeholder="数值越小优先级越高" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listDistributorLevel, getDistributorLevel, delDistributorLevel, addDistributorLevel, updateDistributorLevel } from "@/api/pms/distributorLevel"

export default {
  name: "DistributorLevel",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 经销商等级表格数据
      levelList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        levelName: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        levelName: [
          { required: true, message: "等级名称不能为空", trigger: "blur" }
        ],
        discountRate: [
          { required: true, message: "折扣率不能为空", trigger: "blur" }
        ],
        priority: [
          { required: true, message: "优先级不能为空", trigger: "blur" }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询经销商等级列表 */
    getList() {
      this.loading = true
      listDistributorLevel(this.queryParams).then(response => {
        this.levelList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        levelId: undefined,
        levelName: undefined,
        discountRate: 100,
        visibleDbp: 1,
        visibleRrp: 1,
        priority: 1,
        remark: undefined
      }
      this.resetForm("form")
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm")
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.levelId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = "添加经销商等级"
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const levelId = row.levelId || this.ids
      getDistributorLevel(levelId).then(response => {
        this.form = response.data
        this.open = true
        this.title = "修改经销商等级"
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.levelId != undefined) {
            updateDistributorLevel(this.form).then(response => {
              this.$modal.msgSuccess("修改成功")
              this.open = false
              this.getList()
            })
          } else {
            addDistributorLevel(this.form).then(response => {
              this.$modal.msgSuccess("新增成功")
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const levelIds = row.levelId || this.ids
      this.$modal.confirm('是否确认删除经销商等级编号为"' + levelIds + '"的数据项？').then(function() {
        return delDistributorLevel(levelIds)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess("删除成功")
      }).catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('pms/distributor/level/export', {
        ...this.queryParams
      }, `distributor_level_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>