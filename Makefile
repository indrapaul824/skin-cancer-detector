# Arcane incantation to print all the other targets, from https://stackoverflow.com/a/26339924
help:
	@$(MAKE) -pRrq -f $(lastword $(MAKEFILE_LIST)) : 2>/dev/null | awk -v RS= -F: '/^# File/,/^# Finished Make data base/ {if ($$1 !~ "^[#.]") {print $$1}}' | sort | egrep -v -e '^[^[:alnum:]]' -e '^$@$$'

# Install exact Python and CUDA versions
conda-update:
	conda env update --prune -f environment.yml

# Compile and install exact pip packages
pip-tools:
	pip-compile requirements/prod.in && pip-compile requirements/dev.in
	pip-sync requirements/prod.txt requirements/dev.txt

# Convert keras model to TFJS
con-tfjs:
	@read -p "Enter model name:" model; \
	model_dir=./sc_detector/artifacts/$$model; \
	target_dir=./sc_detector/artifacts/tfjs/$$model; \
	tensorflowjs_converter --input_format keras \
                       $$model_dir.h5 \
                       $$target_dir
	@echo -n "TFJS model.json saved at './sc_detector/artifacts/tfjs'"


# Convert keras model to tflite
con-saved:
	python3 sc_detector/scripts/h5_to_tflite.py

# Convert keras model to ONNX
con-onnx:
	python3 -m tf2onnx.convert \
		--tag serve \
		--signature_def serving_default \
		--saved-model sc_detector/artifacts/saved_model \
		--output sc_detector/artifacts/ONNX/model.onnx