# Set shell to bash instead of sh allow for brace expansion
SHELL=/bin/bash


BIOTOPE_PNG=assets/images/biotope.png
BIOTOPE_BASENAMES=sorry_sulfuric2.png mountain3.png sulfur4.png lava1.png canyon1.png lowland0.png salt4.png canyon2.png
BIOTOPE_FILES=$(addprefix assets/images/biotope/, $(BIOTOPE_BASENAMES))

SPECIES_PNG=assets/images/species.png
SPECIES_FILES=$(wildcard assets/images/species/*.png)

.PHONY: all
all: $(BIOTOPE_PNG) $(SPECIES_PNG)

$(BIOTOPE_PNG): $(BIOTOPE_FILES)
	montage $(BIOTOPE_FILES) \
		-background transparent \
		-geometry 64x64 \
		-tile 8x+0+0 \
		${BIOTOPE_PNG}

$(SPECIES_PNG): $(SPECIES_FILES)
	montage $(SPECIES_FILES) \
		-background transparent \
		-geometry 32x32 \
		-tile 8x+0+0 \
		${SPECIES_PNG}
